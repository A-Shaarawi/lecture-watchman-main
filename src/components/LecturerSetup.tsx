import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { Lecturer } from "@/types/lecturer";

interface LecturerSetupProps {
  onComplete: (lecturer: Lecturer) => void;
}

const LecturerSetup = ({ onComplete }: LecturerSetupProps) => {
  const [name, setName] = useState("");
  const [lecturerId, setLecturerId] = useState("");
  const [currentLecture, setCurrentLecture] = useState("");
  const [lectures, setLectures] = useState<string[]>([]);

  const handleAddLecture = () => {
    if (currentLecture.trim() && !lectures.includes(currentLecture.trim())) {
      setLectures([...lectures, currentLecture.trim()]);
      setCurrentLecture("");
    }
  };

  const handleRemoveLecture = (lecture: string) => {
    setLectures(lectures.filter((l) => l !== lecture));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && lecturerId && lectures.length > 0) {
      onComplete({
        id: Date.now().toString(),
        name,
        lecturerId,
        lectures,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-block gradient-hero text-transparent bg-clip-text mb-4">
            <h1 className="text-5xl font-bold tracking-tight">FaceTrack</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Smart Attendance System for Modern Education
          </p>
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Lecturer Setup</CardTitle>
            <CardDescription>
              Enter your details to get started with automated attendance tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Dr. Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lecturerId">Lecturer ID</Label>
                <Input
                  id="lecturerId"
                  placeholder="LEC-2024-001"
                  value={lecturerId}
                  onChange={(e) => setLecturerId(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="lecture">Your Lectures</Label>
                <div className="flex gap-2">
                  <Input
                    id="lecture"
                    placeholder="e.g., AI 101, Data Science 202"
                    value={currentLecture}
                    onChange={(e) => setCurrentLecture(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddLecture();
                      }
                    }}
                    className="h-11"
                  />
                  <Button
                    type="button"
                    onClick={handleAddLecture}
                    variant="secondary"
                    size="icon"
                    className="h-11 w-11 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {lectures.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {lectures.map((lecture) => (
                      <div
                        key={lecture}
                        className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {lecture}
                        <button
                          type="button"
                          onClick={() => handleRemoveLecture(lecture)}
                          className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 gradient-primary shadow-glow"
                disabled={!name || !lecturerId || lectures.length === 0}
              >
                Continue to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LecturerSetup;
