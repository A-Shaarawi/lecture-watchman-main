import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Camera, CheckCircle2, Users } from "lucide-react";
import { DetectedStudent, mockEnrolledStudents } from "@/types/lecturer";

interface AttendanceScannerProps {
  lectureName: string;
  onBack: () => void;
}

// Simulate detecting some students
const getDetectedStudents = (): DetectedStudent[] => {
  const enrolled = mockEnrolledStudents.default;
  const detectedCount = Math.floor(Math.random() * 3) + 5; // 5-7 students
  return enrolled.slice(0, detectedCount).map(student => ({
    ...student,
    attended: true,
    detectedAt: new Date(),
  }));
};

const AttendanceScanner = ({ lectureName, onBack }: AttendanceScannerProps) => {
  const [isScanning, setIsScanning] = useState(true);
  const [detectedStudents, setDetectedStudents] = useState<DetectedStudent[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Simulate scanning process
    const scanTimeout = setTimeout(() => {
      const detected = getDetectedStudents();
      setIsScanning(false);
      setDetectedStudents(detected);
      setShowNotification(true);
      
      // Hide notification after 5 seconds
      setTimeout(() => setShowNotification(false), 5000);
    }, 3000);

    return () => clearTimeout(scanTimeout);
  }, []);

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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Camera Preview */}
          <Card className="shadow-card border-border/50 p-6">
            <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
              {/* Camera simulation */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 flex items-center justify-center">
                <Camera className="h-16 w-16 text-muted-foreground/40" />
              </div>
              
              {/* Scanning overlay */}
              {isScanning && (
                <>
                  <div className="absolute inset-0 border-4 border-primary/50 animate-scan-pulse rounded-lg" />
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-scan-line" />
                </>
              )}
              
              {/* Status badge */}
              <div className="absolute top-4 left-4">
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  isScanning 
                    ? "bg-accent/90 text-accent-foreground" 
                    : "bg-success/90 text-success-foreground"
                }`}>
                  {isScanning ? "Scanning..." : "Complete"}
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
        {!isScanning && (
          <div className="mt-6 flex gap-4">
            <Button
              onClick={onBack}
              className="flex-1 md:flex-none gradient-primary shadow-glow"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={() => {
                setIsScanning(true);
                setDetectedStudents([]);
                setTimeout(() => {
                  const detected = getDetectedStudents();
                  setIsScanning(false);
                  setDetectedStudents(detected);
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 5000);
                }, 3000);
              }}
              variant="outline"
              className="flex-1 md:flex-none"
            >
              Scan Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceScanner;
