# 🚀 START HERE - Quick Guide

## Step 1: Start the Backend Server

### Easiest Way (Windows):
**Just double-click:** `start_backend.bat`

### Or use Command Line:
```bash
python app_minimal.py
```

## Step 2: What You Should See

When it starts successfully, you'll see:
```
============================================================
Starting Face Detection API (MINIMAL MODE)
============================================================
✅ Face registration: WORKING
✅ Face detection: WORKING
⚠️  Face recognition: NOT AVAILABLE (requires DeepFace)
============================================================
Server starting on http://localhost:5000
```

## Step 3: Test It

1. **Keep the terminal window open** (don't close it!)
2. Open your React app in browser (usually `http://localhost:5173`)
3. Go to **Student Registration**
4. The error message should disappear! ✅

## What Works Now

- ✅ **Face Registration** - Students can register their faces
- ✅ **Face Detection** - Detects faces during attendance
- ⚠️ **Face Recognition** - Not available yet (needs DeepFace fix)

## Common Issues

### "python is not recognized"
- Try: `python3 app_minimal.py`
- Or install Python from python.org

### Port 5000 already in use
- Change port in `app_minimal.py` (last line) to `5001`
- Update `.env` file: `VITE_API_URL=http://localhost:5001`

### Server won't start
- Make sure you're in the project folder
- Check that Flask is installed: `pip install flask flask-cors opencv-python numpy`

## Need Full Face Recognition?

To enable face recognition (matching registered faces):
1. Run: `pip install tf-keras tensorflow`
2. Or double-click: `fix_deepface.bat`
3. Then use `app_simple.py` instead of `app_minimal.py`

## That's It!

Once you see "Running on http://0.0.0.0:5000", you're good to go! 🎉





