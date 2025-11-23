from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import os
import time
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Try to import optional dependencies
try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except ImportError:
    DEEPFACE_AVAILABLE = False
    print("Warning: DeepFace not available. Face recognition will be limited.")

try:
    import mediapipe as mp
    mp_face_detection = mp.solutions.face_detection
    mp_face_mesh = mp.solutions.face_mesh
    MEDIAPIPE_AVAILABLE = True
except ImportError:
    MEDIAPIPE_AVAILABLE = False
    print("Warning: MediaPipe not available. Using OpenCV for basic face detection.")
    # Use OpenCV's built-in face detector as fallback
    try:
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        OPENCV_FACE_DETECTOR_AVAILABLE = True
    except:
        OPENCV_FACE_DETECTOR_AVAILABLE = False
        print("Warning: OpenCV face detector not available.")

# Configuration
FACES_DIR = 'faces'
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Create necessary directories
os.makedirs(FACES_DIR, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Blink detection variables
blink_counters = {}
blink_threshold = 0.3
blink_frames = 3
last_blink_times = {}
liveness_timeout = 3

# Eye landmarks indices
LEFT_EYE = [362, 385, 387, 263, 373, 380]
RIGHT_EYE = [33, 160, 158, 133, 153, 144]

def eye_aspect_ratio(landmarks, eye_indices):
    """Calculate Eye Aspect Ratio for blink detection"""
    p1 = np.array([landmarks[eye_indices[0]].x, landmarks[eye_indices[0]].y])
    p2 = np.array([landmarks[eye_indices[1]].x, landmarks[eye_indices[1]].y])
    p3 = np.array([landmarks[eye_indices[2]].x, landmarks[eye_indices[2]].y])
    p4 = np.array([landmarks[eye_indices[3]].x, landmarks[eye_indices[3]].y])
    p5 = np.array([landmarks[eye_indices[4]].x, landmarks[eye_indices[4]].y])
    p6 = np.array([landmarks[eye_indices[5]].x, landmarks[eye_indices[5]].y])
    ear = (np.linalg.norm(p2 - p6) + np.linalg.norm(p3 - p5)) / (2 * np.linalg.norm(p1 - p4))
    return ear

def decode_base64_image(base64_string):
    """Decode base64 image string to numpy array"""
    try:
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return image
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Face detection API is running"})

@app.route('/api/detect-faces', methods=['POST'])
def detect_faces():
    """Detect and recognize faces from an image"""
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        # Decode base64 image
        image = decode_base64_image(data['image'])
        if image is None:
            return jsonify({"error": "Failed to decode image"}), 400
        
        detected_students = []
        
        # Face detection using available method
        if MEDIAPIPE_AVAILABLE:
            # Use MediaPipe for face detection
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            with mp_face_detection.FaceDetection(
                model_selection=0, 
                min_detection_confidence=0.5
            ) as face_detection, \
            mp_face_mesh.FaceMesh(
                max_num_faces=3, 
                refine_landmarks=True, 
                min_detection_confidence=0.5, 
                min_tracking_confidence=0.5
            ) as face_mesh:
            
            # Process face detection
            face_results = face_detection.process(image_rgb)
            mesh_results = face_mesh.process(image_rgb)
            
            # Liveness detection via blink
            if mesh_results.multi_face_landmarks:
                for i, face_landmarks in enumerate(mesh_results.multi_face_landmarks):
                    if i not in blink_counters:
                        blink_counters[i] = 0
                        last_blink_times[i] = 0
                    
                    left_ear = eye_aspect_ratio(face_landmarks.landmark, LEFT_EYE)
                    right_ear = eye_aspect_ratio(face_landmarks.landmark, RIGHT_EYE)
                    ear = (left_ear + right_ear) / 2.0
                    
                    if ear < blink_threshold:
                        blink_counters[i] += 1
                    else:
                        if blink_counters[i] >= blink_frames:
                            last_blink_times[i] = time.time()
                        blink_counters[i] = 0
            
            # Face recognition
            if face_results.detections:
                for i, detection in enumerate(face_results.detections):
                    bboxC = detection.location_data.relative_bounding_box
                    ih, iw, _ = image.shape
                    x = int(bboxC.xmin * iw)
                    y = int(bboxC.ymin * ih)
                    w = int(bboxC.width * iw)
                    h = int(bboxC.height * ih)
                    
                    # Check liveness
                    is_live = time.time() - last_blink_times.get(i, 0) < liveness_timeout
                    
                    if not is_live:
                        continue  # Skip non-live faces
                    
                    # Extract face region with padding
                    padding = 20
                    x_pad = max(0, x - padding)
                    y_pad = max(0, y - padding)
                    w_pad = min(iw - x_pad, w + 2 * padding)
                    h_pad = min(ih - y_pad, h + 2 * padding)
                    face_image = image[y_pad:y_pad+h_pad, x_pad:x_pad+w_pad]
                    
                    if face_image.size == 0:
                        continue
                    
                    # Save temp image for DeepFace
                    temp_path = os.path.join(UPLOAD_FOLDER, f"temp_face_{i}_{int(time.time())}.jpg")
                    cv2.imwrite(temp_path, face_image)
                    
                    # Recognize face using DeepFace
                    name = "Unknown"
                    confidence = 0.0
                    try:
                        if os.path.exists(FACES_DIR):
                            result = DeepFace.find(
                                img_path=temp_path, 
                                db_path=FACES_DIR, 
                                enforce_detection=False, 
                                silent=True
                            )
                            if result and not result[0].empty:
                                # Get the best match
                                best_match = result[0].iloc[0]
                                identity_path = best_match['identity']
                                name = os.path.basename(os.path.dirname(identity_path))
                                # Get distance/confidence (lower distance = higher confidence)
                                distance = best_match.get('distance', 1.0)
                                confidence = max(0, 1 - distance)  # Convert distance to confidence
                    except Exception as e:
                        print(f"Face recognition error: {e}")
                    
                    # Clean up temp file
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
                    
                    if name != "Unknown" and confidence > 0.5:  # Only return if confidence > 50%
                        detected_students.append({
                            "name": name,
                            "confidence": round(confidence * 100, 2),
                            "bbox": {"x": x, "y": y, "width": w, "height": h},
                            "isLive": is_live
                        })
        
        return jsonify({
            "success": True,
            "detected_students": detected_students,
            "count": len(detected_students)
        })
        
    except Exception as e:
        print(f"Error in detect_faces: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/register-face', methods=['POST'])
def register_face():
    """Register a new face for a student"""
    try:
        data = request.json
        if not data or 'image' not in data or 'studentId' not in data:
            return jsonify({"error": "Missing image or studentId"}), 400
        
        student_id = data['studentId']
        student_name = data.get('studentName', student_id)
        
        # Decode base64 image
        image = decode_base64_image(data['image'])
        if image is None:
            return jsonify({"error": "Failed to decode image"}), 400
        
        # Create student directory
        student_dir = os.path.join(FACES_DIR, secure_filename(student_id))
        os.makedirs(student_dir, exist_ok=True)
        
        # Save face image
        timestamp = int(time.time())
        filename = f"{student_id}_{timestamp}.jpg"
        filepath = os.path.join(student_dir, filename)
        cv2.imwrite(filepath, image)
        
        return jsonify({
            "success": True,
            "message": f"Face registered for {student_name}",
            "studentId": student_id,
            "path": filepath
        })
        
    except Exception as e:
        print(f"Error in register_face: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/students', methods=['GET'])
def get_registered_students():
    """Get list of all registered students"""
    try:
        students = []
        if os.path.exists(FACES_DIR):
            for student_id in os.listdir(FACES_DIR):
                student_path = os.path.join(FACES_DIR, student_id)
                if os.path.isdir(student_path):
                    # Count face images for this student
                    face_count = len([f for f in os.listdir(student_path) 
                                    if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
                    if face_count > 0:
                        students.append({
                            "studentId": student_id,
                            "faceCount": face_count
                        })
        
        return jsonify({
            "success": True,
            "students": students,
            "count": len(students)
        })
        
    except Exception as e:
        print(f"Error in get_registered_students: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Face Detection API...")
    print(f"Faces directory: {os.path.abspath(FACES_DIR)}")
    app.run(host='0.0.0.0', port=5000, debug=True)

