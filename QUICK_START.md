# Quick Start Guide - Face Detection Backend

## Step 1: Install Python Dependencies

Open a terminal in the project directory and run:

```bash
pip install -r requirements.txt
```

**Note:** If you encounter any installation issues, you may need to:
- Use `pip3` instead of `pip`
- Install dependencies one by one
- Use a virtual environment (recommended)

## Step 2: Start the Flask Backend Server

### Option A: Using the Batch File (Windows)
Double-click `start_backend.bat` or run:
```bash
start_backend.bat
```

### Option B: Using Command Line
```bash
python app.py
```

### Option C: Using Python directly
```bash
python -m flask run --host=0.0.0.0 --port=5000
```

## Step 3: Verify the Server is Running

You should see output like:
```
Starting Face Detection API...
Faces directory: [path to faces folder]
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

## Step 4: Start the React Frontend

In a **new terminal window**, run:
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173` (or another port if 5173 is busy).

## Troubleshooting

### Port 5000 Already in Use
If you see "Address already in use", either:
1. Stop the process using port 5000
2. Change the port in `app.py` (last line) to a different port (e.g., 5001)
3. Update `VITE_API_URL` in your `.env` file to match

### Module Not Found Errors
Make sure all dependencies are installed:
```bash
pip install flask flask-cors opencv-python mediapipe deepface numpy werkzeug
```

### Camera Access Issues
- Make sure no other application is using the camera
- Grant browser permissions for camera access
- Try refreshing the page

## Testing the Connection

Once both servers are running:
1. Open the React app in your browser
2. Navigate to Student Registration
3. The error message should disappear
4. You should be able to register faces

## Stopping the Servers

- **Flask Backend:** Press `Ctrl+C` in the terminal running `app.py`
- **React Frontend:** Press `Ctrl+C` in the terminal running `npm run dev`


