# Backend Structure Reference

This file documents the planned backend structure. **Note:** Lovable only supports React frontend development. The backend must be implemented separately using FastAPI.

## Project Structure

```
project/
├── frontend/        → ReactJS (lecturer + student UI) - IMPLEMENTED IN LOVABLE
├── backend/         → FastAPI server (API + logic) - TO BE IMPLEMENTED EXTERNALLY
├── detection/       → Python face detection service - TO BE IMPLEMENTED EXTERNALLY
└── database/        → MySQL schema + scripts - TO BE IMPLEMENTED EXTERNALLY
```

## Backend Structure (FastAPI)

```
backend/
├── main.py                 # FastAPI application entry point
├── models.py               # SQLAlchemy database models
├── schemas.py              # Pydantic schemas for request/response
├── database.py             # Database connection and session
└── routes/
    ├── lecturer.py         # Lecturer-related endpoints
    ├── student.py          # Student-related endpoints
    └── attendance.py       # Attendance-related endpoints
```

## API Endpoints to Implement

### Lecturer Endpoints
- `POST /lecturer/register` - Register new lecturer
- `POST /lecturer/login` - Lecturer authentication
- `GET /lecturer/lectures` - Get lecturer's lectures
- `POST /lecturer/lectures` - Add new lecture

### Student Endpoints
- `POST /student/register` - Register new student with face encoding
- `GET /student/schedule` - Get student's lecture schedule
- `GET /student/attendance` - Get student's attendance records

### Attendance Endpoints
- `POST /attendance/start-detection` - Start face detection for a lecture
- `POST /attendance/mark` - Mark attendance for detected student
- `GET /attendance/records/:lectureId` - Get attendance records for a lecture

## Database Schema (MySQL)

### Tables
1. **lecturers**
   - id (PRIMARY KEY)
   - name
   - lecturer_id (UNIQUE)
   - email
   - password_hash
   - created_at

2. **lectures**
   - id (PRIMARY KEY)
   - lecturer_id (FOREIGN KEY)
   - title
   - created_at

3. **students**
   - id (PRIMARY KEY)
   - name
   - student_id (UNIQUE)
   - face_encoding (TEXT/BLOB)
   - created_at

4. **student_lectures**
   - id (PRIMARY KEY)
   - student_id (FOREIGN KEY)
   - lecture_id (FOREIGN KEY)

5. **attendance_records**
   - id (PRIMARY KEY)
   - lecture_id (FOREIGN KEY)
   - student_id (FOREIGN KEY)
   - session_date
   - status (present/absent)
   - detected_at
   - created_at

## Face Detection Service

```
detection/
├── face_service.py         # Face detection and recognition logic
├── encodings/              # Stored face encodings
└── requirements.txt        # Python dependencies (face_recognition, opencv-python)
```

## Next Steps

1. Set up FastAPI backend locally
2. Implement face_recognition service
3. Connect frontend to backend APIs
4. Deploy backend and detection service
