import { useState, useEffect, useRef } from "react";
import { Button, Card } from "@/components/ui/ui-core";
import { ArrowLeft, Camera, CheckCircle2, Users, AlertCircle } from "lucide-react";
import { DetectedStudent } from "@/types/lecturer";
import { captureFrame, detectFaces, checkApiHealth, type DetectedStudent as ApiDetectedStudent } from "@/services/faceDetectionApi";

interface AttendanceScannerProps {
  lectureName: string;
  onBack: () => void;
}

const AttendanceScanner = ({ lectureName, onBack }: AttendanceScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedStudents, setDetectedStudents] = useState<DetectedStudent[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const detectedNamesRef = useRef<Set<string>>(new Set());

  // Check API health on mount
  useEffect(() => {
    checkApiHealth().then(setApiConnected);
  }, []);

  // Start/stop camera and scanning
  useEffect(() => {
    if (isScanning) {
      startCamera();
      startScanning();
    } else {
      stopScanning();
      stopCamera();
    }

    return () => {
      stopScanning();
      stopCamera();
    };
  }, [isScanning]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 }
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setError("Failed to access camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startScanning = () => {
    detectedNamesRef.current.clear();
    setDetectedStudents([]);
    setError(null);

    // Scan every 2 seconds
    scanIntervalRef.current = window.setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const frame = captureFrame(videoRef.current);
        if (frame) {
          try {
            const response = await detectFaces(frame);
            if (response.success && response.detected_students.length > 0) {
              // Add new detected students
              response.detected_students.forEach((apiStudent: ApiDetectedStudent) => {
                if (!detectedNamesRef.current.has(apiStudent.name)) {
                  detectedNamesRef.current.add(apiStudent.name);
                  setDetectedStudents(prev => {
                    // Check if student already exists
                    const exists = prev.some(s => s.name === apiStudent.name);
                    if (!exists) {
                      return [...prev, {
                        id: apiStudent.name,
                        name: apiStudent.name,
                        studentId: apiStudent.name, // You may want to map this properly
                        attended: true,
                        detectedAt: new Date(),
                      }];
                    }
                    return prev;
                  });
                }
              });
            }
          } catch (error) {
            console.error("Face detection error:", error);
            if (!apiConnected) {
              setError("API connection failed. Please ensure the backend server is running.");
            }
          }
        }
      }
    }, 2000);
  };

  const stopScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
  };

  const handleStopScan = () => {
    setIsScanning(false);
    if (detectedStudents.length > 0) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  const handleScanAgain = () => {
    detectedNamesRef.current.clear();
    setDetectedStudents([]);
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <Card className="bg-success text-success-foreground px-6 py-3 shadow-glow border-0">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5" />
              <div>
                <p className="font-semibold">Attendance submitted successfully!</p>
                <p className="text-sm opacity-90">Students have been notified.</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-primary text-transparent bg-clip-text">
              {lectureName}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isScanning ? "Scanning for faces..." : "Scan complete"}
            </p>
          </div>
        </div>

        {/* API Connection Status */}
        {!apiConnected && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Backend API not connected</p>
                <p className="text-sm">Please start the Flask server: <code className="bg-muted px-1 rounded">python app.py</code></p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Camera Preview */}
          <Card className="shadow-card border-border/50 p-6">
            <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
              {isScanning && videoRef.current ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 border-4 border-primary/50 animate-scan-pulse rounded-lg pointer-events-none" />
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-scan-line pointer-events-none" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 flex items-center justify-center">
                  <Camera className="h-16 w-16 text-muted-foreground/40" />
                </div>
              )}
              
              {/* Status badge */}
              <div className="absolute top-4 left-4 z-10">
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  isScanning 
                    ? "bg-accent/90 text-accent-foreground" 
                    : "bg-muted/90 text-muted-foreground"
                }`}>
                  {isScanning ? "Scanning..." : "Ready"}
                </div>
              </div>
            </div>

            {!isScanning && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">
                      {detectedStudents.length} Students Detected
                    </p>
                    <p className="text-sm text-muted-foreground">
                      All students marked as attended
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Detected Students List */}
          <Card className="shadow-card border-border/50 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Detected Students
            </h2>

            {isScanning ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted/50 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {detectedStudents.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300 animate-in slide-in-from-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.studentId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Attended</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          {!isScanning ? (
            <>
              <Button
                onClick={handleStartScan}
                disabled={!apiConnected}
                className="flex-1 md:flex-none gradient-primary shadow-glow"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
              {detectedStudents.length > 0 && (
                <Button
                  onClick={handleScanAgain}
                  variant="outline"
                  className="flex-1 md:flex-none"
                >
                  Scan Again
                </Button>
              )}
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 md:flex-none"
              >
                Back to Dashboard
              </Button>
            </>
          ) : (
            <Button
              onClick={handleStopScan}
              variant="destructive"
              className="flex-1 md:flex-none"
            >
              Stop Scanning
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceScanner;
