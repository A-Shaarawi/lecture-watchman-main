import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CameraView from "@/components/CameraView";

interface StudentRegisterProps {
  onRegister: (student: any) => void;
  onBack: () => void;
}

export default function StudentRegister({ onRegister, onBack }: StudentRegisterProps) {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState<string[]>([""]);
  const [showCamera, setShowCamera] = useState(false);
  const [faceRegistered, setFaceRegistered] = useState(false);

  const handleAddLecture = () => {
    setSchedule([...schedule, ""]);
  };

  const handleScheduleChange = (index: number, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index] = value;
    setSchedule(newSchedule);
  };

  const handleRemoveLecture = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleFaceCapture = () => {
    setFaceRegistered(true);
    setShowCamera(false);
    toast.success("Face registered successfully!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !studentId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!faceRegistered) {
      toast.error("Please register your face");
      return;
    }

    const filteredSchedule = schedule.filter(l => l.trim() !== "");
    if (filteredSchedule.length === 0) {
      toast.error("Please add at least one lecture to your schedule");
      return;
    }

    const student = {
      id: Date.now().toString(),
      name,
      studentId,
      schedule: filteredSchedule,
      faceEncoding: "mock-face-encoding",
      registeredAt: new Date().toISOString(),
    };

    localStorage.setItem("student", JSON.stringify(student));
    toast.success("Registration completed successfully!");
    onRegister(student);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Student Registration
              </CardTitle>
              <CardDescription>Register your face and schedule for attendance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="STU-2024-001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Face Registration</Label>
                  <div className="space-y-2">
                    {!showCamera && !faceRegistered && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCamera(true)}
                        className="w-full"
                      >
                        Scan Face
                      </Button>
                    )}
                    {showCamera && (
                      <CameraView
                        onCapture={handleFaceCapture}
                        onClose={() => setShowCamera(false)}
                      />
                    )}
                    {faceRegistered && (
                      <div className="p-4 bg-accent/10 border border-accent/20 rounded-md">
                        <p className="text-sm text-accent font-medium">✓ Face registered successfully</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Lecture Schedule</Label>
                  {schedule.map((lecture, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={lecture}
                        onChange={(e) => handleScheduleChange(index, e.target.value)}
                        placeholder="e.g., AI 101"
                      />
                      {schedule.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleRemoveLecture(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddLecture}
                    className="w-full"
                  >
                    + Add Lecture
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
                    Complete Registration
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
