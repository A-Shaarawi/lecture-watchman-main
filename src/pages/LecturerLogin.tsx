import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lecturer } from "@/types/lecturer";

interface LecturerLoginProps {
  onLogin: (lecturer: Lecturer) => void;
  onBack: () => void;
}

export default function LecturerLogin({ onLogin, onBack }: LecturerLoginProps) {
  const [name, setName] = useState("");
  const [lecturerId, setLecturerId] = useState("");
  const [lectures, setLectures] = useState<string[]>([""]);

  const handleAddLecture = () => {
    setLectures([...lectures, ""]);
  };

  const handleLectureChange = (index: number, value: string) => {
    const newLectures = [...lectures];
    newLectures[index] = value;
    setLectures(newLectures);
  };

  const handleRemoveLecture = (index: number) => {
    setLectures(lectures.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !lecturerId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const filteredLectures = lectures.filter(l => l.trim() !== "");
    if (filteredLectures.length === 0) {
      toast.error("Please add at least one lecture");
      return;
    }

    const lecturer: Lecturer = {
      id: Date.now().toString(),
      name,
      lecturerId,
      lectures: filteredLectures,
    };

    localStorage.setItem("lecturer", JSON.stringify(lecturer));
    toast.success("Profile created successfully!");
    onLogin(lecturer);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Lecturer Setup
          </CardTitle>
          <CardDescription>Create your profile to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. John Smith"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lecturerId">Lecturer ID</Label>
              <Input
                id="lecturerId"
                value={lecturerId}
                onChange={(e) => setLecturerId(e.target.value)}
                placeholder="LEC-2024-001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Lectures</Label>
              {lectures.map((lecture, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={lecture}
                    onChange={(e) => handleLectureChange(index, e.target.value)}
                    placeholder="e.g., AI 101"
                  />
                  {lectures.length > 1 && (
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
              <Button type="submit" className="flex-1">
                Save & Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
