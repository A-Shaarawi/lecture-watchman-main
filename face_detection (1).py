import cv2
import mediapipe as mp
import numpy as np
import time
from deepface import DeepFace
import os

# Initialize MediaPipe Face Detection and Face Mesh (CPU-based for Windows compatibility)
mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh

# Blink detection variables (per face)
blink_counters = {}
blink_threshold = 0.3  # EAR threshold for blink
blink_frames = 3  # Consecutive frames for blink
last_blink_times = {}
liveness_timeout = 3  # Seconds to consider live after blink

def eye_aspect_ratio(landmarks, eye_indices):
    # Calculate EAR for eye
    p1 = np.array([landmarks[eye_indices[0]].x, landmarks[eye_indices[0]].y])
    p2 = np.array([landmarks[eye_indices[1]].x, landmarks[eye_indices[1]].y])
    p3 = np.array([landmarks[eye_indices[2]].x, landmarks[eye_indices[2]].y])
    p4 = np.array([landmarks[eye_indices[3]].x, landmarks[eye_indices[3]].y])
    p5 = np.array([landmarks[eye_indices[4]].x, landmarks[eye_indices[4]].y])
    p6 = np.array([landmarks[eye_indices[5]].x, landmarks[eye_indices[5]].y])
    ear = (np.linalg.norm(p2 - p6) + np.linalg.norm(p3 - p5)) / (2 * np.linalg.norm(p1 - p4))
    return ear

# Eye landmarks indices
LEFT_EYE = [362, 385, 387, 263, 373, 380]
RIGHT_EYE = [33, 160, 158, 133, 153, 144]

# DeepFace will handle loading from 'faces' directory
faces_dir = 'faces'
if not os.path.exists(faces_dir):
    print("Faces directory not found. Create 'faces' folder with subfolders named after people, each containing their images.")
else:
    print("Using DeepFace for recognition from 'faces' directory.")

# Initialize webcam (use 2 for third camera)
cap = cv2.VideoCapture(2)

with mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.5) as face_detection, \
     mp_face_mesh.FaceMesh(max_num_faces=3, refine_landmarks=True, min_detection_confidence=0.5, min_tracking_confidence=0.5) as face_mesh:
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            continue

        # To improve performance, optionally mark the image as not writeable to pass by reference.
        image.flags.writeable = False
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        face_results = face_detection.process(image_rgb)
        mesh_results = face_mesh.process(image_rgb)

        # Draw the face detection annotations on the image.
        image.flags.writeable = True
        image = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)

        # Liveness detection via blink (per face)
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

        if face_results.detections:
            for i, detection in enumerate(face_results.detections):
                # Draw bounding box only, no landmarks
                bboxC = detection.location_data.relative_bounding_box
                ih, iw, _ = image.shape
                x, y, w, h = int(bboxC.xmin * iw), int(bboxC.ymin * ih), int(bboxC.width * iw), int(bboxC.height * ih)
                cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

                # Face recognition using DeepFace
                name = "Unknown"
                try:
                    # Add padding to bounding box for better recognition
                    padding = 20
                    x_pad = max(0, x - padding)
                    y_pad = max(0, y - padding)
                    w_pad = min(iw - x_pad, w + 2 * padding)
                    h_pad = min(ih - y_pad, h + 2 * padding)
                    face_image = image[y_pad:y_pad+h_pad, x_pad:x_pad+w_pad]
                    if face_image.size == 0:
                        raise ValueError("Empty face image")
                    # Save temp image for DeepFace
                    temp_path = f"temp_face_{i}.jpg"
                    cv2.imwrite(temp_path, face_image)
                    # Find match in faces directory
                    result = DeepFace.find(img_path=temp_path, db_path=faces_dir, enforce_detection=False, silent=True)
                    if result and not result[0].empty:
                        name = result[0]['identity'][0].split(os.sep)[-2]  # Get folder name
                        print(f"Recognized: {name}")
                    os.remove(temp_path)
                except Exception as e:
                    print(f"Face recognition error: {e}")
                    name = "Unknown"

                # Display liveness status
                is_live = time.time() - last_blink_times.get(i, 0) < liveness_timeout
                status = "Live" if is_live else "Not Live"
                color = (0, 255, 0) if is_live else (0, 0, 255)
                cv2.putText(image, status, (x, y - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

                # Display name
                cv2.putText(image, name, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)

        # Flip the image horizontally for a selfie-view display.
        cv2.imshow('MediaPipe Face Detection with Liveness', cv2.flip(image, 1))
        if cv2.waitKey(5) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
