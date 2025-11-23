@echo off
echo Starting Face Detection Backend Server...
echo.
echo Make sure you have installed the requirements:
echo   pip install -r requirements.txt
echo.
echo Starting Flask server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
echo.
echo Using minimal version (works without DeepFace/MediaPipe)
echo Face registration will work, but recognition requires DeepFace
echo.
python app_minimal.py
pause

