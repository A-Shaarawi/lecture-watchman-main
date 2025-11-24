# Face Detection Integration Guide

This guide explains how to set up and use the face detection system integrated into Lecture Watchman.

## Prerequisites

1. Python 3.8 or higher
2. Node.js and npm (for the React frontend)
3. Webcam access

## Backend Setup

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Create Faces Directory

The system needs a `faces` directory to store registered student faces. Each student should have their own subfolder named with their student ID.

```bash
mkdir faces
```

Example structure:
```
faces/
  ├── STU-2024-001/
  │   ├── STU-2024-001_1234567890.jpg
  │   └── STU-2024-001_1234567891.jpg
  ├── STU-2024-002/
  │   └── STU-2024-002_1234567892.jpg
  └── ...
```

### 3. Start the Flask Backend Server

```bash
python app.py
```

The server will start on `http://localhost:5000` by default.

## Frontend Setup

### 1. Environment Variables (Optional)

Create a `.env` file in the root directory if you need to change the API URL:

```env
VITE_API_URL=http://localhost:5000
```

### 2. Start the React Development Server

```bash
npm run dev
```

## Usage

### Student Registration

1. Navigate to Student Registration
2. Fill in your name and Student ID
3. Click "Scan Face" to open the camera
4. Position your face within the frame
5. Click "Capture Face" to register your face
6. Complete the registration form

### Taking Attendance

1. Navigate to "Take Attendance" as a lecturer
2. Select the course
3. Click "Start Scanning"
4. The system will automatically detect and recognize students' faces
5. Detected students will appear in the list
6. Click "Stop Scanning" when done

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns API status

### Detect Faces
- **POST** `/api/detect-faces`
- Body: `{ "image": "base64_encoded_image" }`
- Returns: List of detected students with confidence scores

### Register Face
- **POST** `/api/register-face`
- Body: `{ "image": "base64_encoded_image", "studentId": "STU-2024-001", "studentName": "John Doe" }`
- Returns: Registration confirmation

### Get Registered Students
- **GET** `/api/students`
- Returns: List of all registered students

## Features

- **Real-time Face Detection**: Uses MediaPipe for fast face detection
- **Face Recognition**: Uses DeepFace for accurate student identification
- **Liveness Detection**: Blink detection to prevent spoofing
- **Confidence Scoring**: Each detection includes a confidence score
- **Multiple Face Support**: Can detect and recognize multiple faces simultaneously

## Troubleshooting

### Backend API not connected
- Ensure the Flask server is running: `python app.py`
- Check that port 5000 is not in use
- Verify firewall settings allow connections

### Camera not working
- Check browser permissions for camera access
- Ensure no other application is using the camera
- Try refreshing the page

### Face recognition not working
- Ensure students have registered their faces first
- Check that the `faces` directory exists and contains student folders
- Verify image quality (good lighting, clear face)

### Low confidence scores
- Ensure good lighting conditions
- Make sure the face is clearly visible
- Try registering multiple face images for better accuracy

## Technical Details

- **Face Detection**: MediaPipe Face Detection (CPU-based)
- **Face Recognition**: DeepFace with VGG-Face model
- **Liveness Detection**: Eye Aspect Ratio (EAR) based blink detection
- **Image Processing**: OpenCV for image manipulation
- **API Framework**: Flask with CORS support





