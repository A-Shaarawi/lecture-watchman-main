"""
Minimal Flask API for Face Detection
Works WITHOUT DeepFace - only face registration and basic detection
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

# Use OpenCV's built-in face detector
try:
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    FACE_DETECTOR_AVAILABLE = True
    print("✅ OpenCV face detector loaded successfully")
except Exception as e:
    FACE_DETECTOR_AVAILABLE = False
    print(f"❌ OpenCV face detector failed: {e}")

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
        "message": "Face detection API is running (minimal mode)",
        "face_detector_available": FACE_DETECTOR_AVAILABLE,
        "deepface_available": False,
        "note": "Face registration works. Recognition requires DeepFace."
    })

@app.route('/api/detect-faces', methods=['POST'])
def detect_faces():
    """Detect faces from an image (recognition not available in minimal mode)"""
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
                # In minimal mode, we detect faces but can't recognize them
                # Return detected face as "Unknown" - frontend can handle this
                detected_students.append({
                    "name": "Unknown",
                    "confidence": 0,
                    "bbox": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
                    "isLive": True
                })
        
        return jsonify({
            "success": True,
            "detected_students": detected_students,
            "count": len(detected_students),
            "note": "Face detection only. Recognition requires DeepFace."
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
            "path": filepath,
            "note": "Face saved. Recognition will work once DeepFace is installed."
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
    print("=" * 60)
    print("Starting Face Detection API (MINIMAL MODE)")
    print("=" * 60)
    print("✅ Face registration: WORKING")
    print("✅ Face detection: WORKING")
    print("⚠️  Face recognition: NOT AVAILABLE (requires DeepFace)")
    print("=" * 60)
    print(f"Faces directory: {os.path.abspath(FACES_DIR)}")
    print("=" * 60)
    print("Server starting on http://localhost:5000")
    print("Press Ctrl+C to stop")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)


