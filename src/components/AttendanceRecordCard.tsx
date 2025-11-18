import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AttendanceRecord } from "@/types/lecturer";
import { Camera, CameraOff, Calendar, Users, UserX, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AttendanceRecordCardProps {
  record: AttendanceRecord;
  onToggleCamera: (recordId: string) => void;
}

const AttendanceRecordCard = ({ record, onToggleCamera }: AttendanceRecordCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isCameraOpen = record.cameraStatus === 'open';

  return (
    <Card className="shadow-card border-border/50 hover:shadow-glow transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{record.lectureName}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(record.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </div>
          <Badge
            variant={isCameraOpen ? "default" : "secondary"}
            className={isCameraOpen ? "bg-success text-success-foreground" : ""}
          >
            {isCameraOpen ? "Camera Active" : "Camera Closed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg border border-success/20">
            <Users className="h-5 w-5 text-success" />
            <div>
              <p className="text-2xl font-bold text-success">{record.attendedStudents.length}</p>
              <p className="text-xs text-muted-foreground">Attended</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <UserX className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-2xl font-bold text-destructive">{record.absentStudents.length}</p>
              <p className="text-xs text-muted-foreground">Absent</p>
            </div>
          </div>
        </div>

        {/* Student Details (Collapsible) */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              View Student Details
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            {/* Attended Students */}
            {record.attendedStudents.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-success mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Attended Students
                </h4>
                <div className="space-y-2">
                  {record.attendedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-2 bg-success/5 rounded border border-success/10"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.studentId}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-success border-success/50">
                        Present
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Absent Students */}
            {record.absentStudents.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
                  <UserX className="h-4 w-4" />
                  Absent Students
                </h4>
                <div className="space-y-2">
                  {record.absentStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-2 bg-destructive/5 rounded border border-destructive/10"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.studentId}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-destructive border-destructive/50">
                        Absent
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Camera Control */}
        <Button
          onClick={() => onToggleCamera(record.id)}
          className={`w-full gap-2 ${
            isCameraOpen
              ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              : "gradient-primary shadow-glow"
          }`}
        >
          {isCameraOpen ? (
            <>
              <CameraOff className="h-4 w-4" />
              Close Camera
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              Open Camera
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AttendanceRecordCard;
