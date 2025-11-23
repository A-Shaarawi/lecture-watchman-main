// Face Detection API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface DetectedStudent {
  name: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isLive: boolean;
}

export interface FaceDetectionResponse {
  success: boolean;
  detected_students: DetectedStudent[];
  count: number;
}

export interface RegisterFaceResponse {
  success: boolean;
  message: string;
  studentId: string;
  path: string;
}

/**
 * Convert video frame to base64
 */
export const captureFrame = (videoElement: HTMLVideoElement): string | null => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(videoElement, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error('Error capturing frame:', error);
    return null;
  }
};

/**
 * Detect faces in an image
 */
export const detectFaces = async (imageBase64: string): Promise<FaceDetectionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/detect-faces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error detecting faces:', error);
    throw error;
  }
};

/**
 * Register a face for a student
 */
export const registerFace = async (
  imageBase64: string,
  studentId: string,
  studentName?: string
): Promise<RegisterFaceResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/register-face`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64,
        studentId,
        studentName: studentName || studentId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering face:', error);
    throw error;
  }
};

/**
 * Get list of registered students
 */
export const getRegisteredStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/students`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting registered students:', error);
    throw error;
  }
};

/**
 * Health check for API
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};


