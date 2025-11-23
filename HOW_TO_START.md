# 🚀 How to Start the Backend Server

## Quick Start (Easiest Method)

### Windows:
1. **Double-click** `start_backend.bat` in the project folder
2. A terminal window will open showing the server starting
3. **Keep this window open** while using the app
4. You should see: `Server starting on http://localhost:5000`

### Mac/Linux:
1. Open terminal in the project folder
2. Run: `chmod +x start_backend.sh && ./start_backend.sh`
3. Or run: `python app_simple.py`

## Manual Start

1. Open PowerShell or Command Prompt
2. Navigate to the project folder:
   ```
   cd "E:\lecture watch man git\lecture-watchman-main"
   ```
3. Run:
   ```
   python app_simple.py
   ```

## What You Should See

When the server starts successfully, you'll see:
```
==================================================
Starting Face Detection API (Simplified Version)
==================================================
Faces directory: [path]
DeepFace available: True/False
Face detector available: True
==================================================
Server starting on http://localhost:5000
Press Ctrl+C to stop
==================================================
 * Running on http://0.0.0.0:5000
```

## After Starting the Server

1. ✅ The error message in your browser should disappear
2. ✅ You can now register faces
3. ✅ Face detection will work during attendance

## Important Notes

- **Keep the terminal window open** - closing it stops the server
- The server runs on `http://localhost:5000`
- If port 5000 is busy, change it in `app_simple.py` (last line)

## Troubleshooting

### "python is not recognized"
- Make sure Python is installed
- Try `python3` instead of `python`
- Add Python to your PATH

### "Module not found"
Install missing packages:
```bash
pip install flask flask-cors opencv-python numpy werkzeug
```

### Port 5000 already in use
Change the port in `app_simple.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=True)
```

Then update your frontend `.env` file:
```
VITE_API_URL=http://localhost:5001
```

## Testing

Once the server is running:
1. Open your React app (should be running on another port)
2. Go to Student Registration
3. The error should be gone! ✅

