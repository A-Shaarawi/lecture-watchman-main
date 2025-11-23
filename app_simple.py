"""
Simplified Flask API for Face Detection
This version works without MediaPipe (for Python 3.13 compatibility)
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import os
import time
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration
FACES_DIR = 'faces'
UPLOAD_FOLDER = 'uploads'

# Create necessary directories
os.makedirs(FACES_DIR, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Try to import DeepFace
DEEPFACE_AVAILABLE = False
try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except (ImportError, ModuleNotFoundError, Exception) as e:
    DEEPFACE_AVAILABLE = False
    print("⚠️  DeepFace not available. Face recognition will be limited.")
    print(f"   Error: {str(e)[:100]}")
    print("   You can still register faces, but recognition may not work.")
    print("   To fix: pip install tf-keras tensorflow")

# Use OpenCV's built-in face detector
try:
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    FACE_DETECTOR_AVAILABLE = True
except:
    FACE_DETECTOR_AVAILABLE = False
    print("⚠️  OpenCV face detector not available.")

def decode_base64_image(base64_string):
    """Decode base64 image string to numpy array"""
    try:
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
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
    return jsonify({
        "status": "ok",
        "message": "Face detection API is running",
        "deepface_available": DEEPFACE_AVAILABLE,
        "face_detector_available": FACE_DETECTOR_AVAILABLE
    })

@app.route('/api/detect-faces', methods=['POST'])
def detect_faces():
    """Detect and recognize faces from an image"""
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        image = decode_base64_image(data['image'])
        if image is None:
            return jsonify({"error": "Failed to decode image"}), 400
        
        detected_students = []
        
        if FACE_DETECTOR_AVAILABLE:
            # Convert to grayscale for face detection
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            for i, (x, y, w, h) in enumerate(faces):
                # Extract face region with padding
                padding = 20
                x_pad = max(0, x - padding)
                y_pad = max(0, y - padding)
                w_pad = min(image.shape[1] - x_pad, w + 2 * padding)
                h_pad = min(image.shape[0] - y_pad, h + 2 * padding)
                face_image = image[y_pad:y_pad+h_pad, x_pad:x_pad+w_pad]
                
                if face_image.size == 0:
                    continue
                
                # Save temp image for DeepFace
                temp_path = os.path.join(UPLOAD_FOLDER, f"temp_face_{i}_{int(time.time())}.jpg")
                cv2.imwrite(temp_path, face_image)
                
                # Recognize face using DeepFace (if available)
                name = "Unknown"
                confidence = 0.0
                
                if DEEPFACE_AVAILABLE and os.path.exists(FACES_DIR):
                    try:
                        result = DeepFace.find(
                            img_path=temp_path,
                            db_path=FACES_DIR,
                            enforce_detection=False,
                            silent=True
                        )
                        if result and not result[0].empty:
                            best_match = result[0].iloc[0]
                            identity_path = best_match['identity']
                            name = os.path.basename(os.path.dirname(identity_path))
                            distance = best_match.get('distance', 1.0)
                            confidence = max(0, 1 - distance)
                    except Exception as e:
                        # Silently fail - face detection still works, just no recognition
                        pass
                else:
                    # Without DeepFace, we can still detect faces but not recognize them
                    # Return detected face with "Unknown" name
                    pass
                
                # Clean up temp file
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                
                # Add detected face (even if not recognized)
                # Frontend can handle "Unknown" faces
                detected_students.append({
                    "name": name if name != "Unknown" and confidence > 0.5 else "Unknown",
                    "confidence": round(confidence * 100, 2) if confidence > 0.5 else 0,
                    "bbox": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
                    "isLive": True  # Simplified version doesn't check liveness
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
    print("=" * 50)
    print("Starting Face Detection API (Simplified Version)")
    print("=" * 50)
    print(f"Faces directory: {os.path.abspath(FACES_DIR)}")
    print(f"DeepFace available: {DEEPFACE_AVAILABLE}")
    print(f"Face detector available: {FACE_DETECTOR_AVAILABLE}")
    print("=" * 50)
    print("Server starting on http://localhost:5000")
    print("Press Ctrl+C to stop")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)

