import { useState } from "react";
import { ArrowLeft, Camera as CameraIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CameraView from "@/components/CameraView";

interface TakeAttendanceProps {
  onBack: () => void;
}

export default function TakeAttendance({ onBack }: TakeAttendanceProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  const students = [
    { id: "1", name: "Youssef Mysara", studentId: "FCI22045" },
    { id: "2", name: "Youssef Mysara", studentId: "FCI22045" },
    { id: "3", name: "Youssef Mysara", studentId: "FCI22045" },
    { id: "4", name: "Youssef Mysara", studentId: "FCI22045" },
    { id: "5", name: "Youssef Mysara", studentId: "FCI22045" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Take Attendance</h1>
          <p className="text-sm text-muted-foreground">Record attendance with face detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Feed */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">Camera Feed</h2>
            <p className="text-sm text-muted-foreground mb-4">Real-time face detection</p>

            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="mb-4">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cg">Computer Graphics</SelectItem>
                <SelectItem value="sm">Software Management</SelectItem>
                <SelectItem value="smt">Software Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
              {cameraActive ? (
                <CameraView onCapture={() => {}} onClose={() => setCameraActive(false)} />
              ) : (
                <CameraIcon className="w-16 h-16 text-muted-foreground" />
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setCameraActive(true)}
                disabled={cameraActive || !selectedCourse}
                className="flex-1 gap-2"
              >
                <CameraIcon className="w-4 h-4" />
                Start camera
              </Button>
              <Button
                onClick={() => setCameraActive(false)}
                disabled={!cameraActive}
                variant="destructive"
                className="flex-1 gap-2"
              >
                Stop camera
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">Students List</h2>
            <p className="text-sm text-muted-foreground mb-4">Attendance status</p>

            <div className="space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.studentId}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
