import { useEffect, useRef, useState } from "react";
import { Button, Card, CardContent } from "@/components/ui/ui-core";
import { Camera, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { captureFrame, registerFace, checkApiHealth } from "@/services/faceDetectionApi";

interface CameraViewProps {
  onCapture: (success: boolean) => void;
  onClose: () => void;
  studentId?: string;
  studentName?: string;
}

export default function CameraView({ onCapture, onClose, studentId, studentName }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    checkApiHealth().then(setApiConnected);
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 1280, height: 720 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setError(null);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setError("Failed to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !studentId) {
      setError("Student ID is required for face registration");
      return;
    }

    setIsCapturing(true);
    setError(null);
    setSuccess(false);

    try {
      const frame = captureFrame(videoRef.current);
      if (!frame) {
        throw new Error("Failed to capture frame");
      }

      if (!apiConnected) {
        throw new Error("Backend API not connected. Please start the Flask server.");
      }

      const response = await registerFace(frame, studentId, studentName);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          stopCamera();
          onCapture(true);
        }, 1500);
      } else {
        throw new Error("Face registration failed");
      }
    } catch (error: any) {
      console.error("Error capturing face:", error);
      setError(error.message || "Failed to register face. Please try again.");
      setIsCapturing(false);
    }
  };

  return (
    <Card className="bg-gradient-card border-primary/20">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <span className="font-medium">Face Registration</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* API Connection Status */}
          {!apiConnected && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <p>Backend API not connected. Face registration requires the Flask server.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2 text-success text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <p>Face registered successfully!</p>
              </div>
            </div>
          )}

          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">Initializing camera...</p>
              </div>
            )}
            
            <div className="absolute inset-0 border-2 border-accent/50 rounded-lg pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-accent rounded-lg" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleCapture} 
              disabled={!isCameraActive || isCapturing || !apiConnected || !studentId}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {isCapturing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Face
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isCapturing}>
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Position your face within the frame and click Capture
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
