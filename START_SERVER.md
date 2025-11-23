# How to Start the Flask Backend Server

## The Problem
You're seeing: **"Backend API not connected. Face registration requires the Flask server."**

This means the Flask backend server is not running. Follow these steps to start it.

## Quick Solution

### Step 1: Open a Terminal/Command Prompt
Open PowerShell, Command Prompt, or your terminal in the project directory:
```
E:\lecture watch man git\lecture-watchman-main
```

### Step 2: Install Dependencies (if not already installed)
```bash
pip install flask flask-cors opencv-python numpy werkzeug
```

**Note:** MediaPipe and DeepFace may require Python 3.8-3.11. If you have Python 3.13, you may need to:
- Use Python 3.11 or earlier, OR
- Install MediaPipe from a pre-built wheel, OR
- Use an alternative face detection method

### Step 3: Start the Flask Server
```bash
python app.py
```

You should see:
```
Starting Face Detection API...
Faces directory: [path]
 * Running on http://0.0.0.0:5000
```

### Step 4: Keep the Terminal Open
**Important:** Keep this terminal window open while using the app. Closing it will stop the server.

### Step 5: Test in Browser
1. Make sure your React frontend is running (`npm run dev`)
2. Refresh the Student Registration page
3. The error should disappear

## Alternative: Use the Batch File (Windows)
Simply double-click `start_backend.bat` in the project folder.

## Troubleshooting

### "Module not found" errors
Install missing packages:
```bash
pip install [package-name]
```

### "Port 5000 already in use"
Change the port in `app.py` (last line) from `5000` to `5001`, then update your frontend `.env` file:
```
VITE_API_URL=http://localhost:5001
```

### MediaPipe Installation Issues
If MediaPipe won't install on Python 3.13:
1. Consider using Python 3.11
2. Or modify `app.py` to use an alternative face detection library
3. Or comment out MediaPipe features temporarily

## What Should Happen
Once the server is running:
- ✅ The error message disappears
- ✅ You can register faces
- ✅ Face detection works during attendance

