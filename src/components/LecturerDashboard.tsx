import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lecturer, AttendanceRecord, mockEnrolledStudents } from "@/types/lecturer";
import { LogOut, BookOpen, TrendingUp, UserCheck, CalendarDays } from "lucide-react";
import AttendanceRecordCard from "./AttendanceRecordCard";
import { toast } from "@/hooks/use-toast";

interface LecturerDashboardProps {
  lecturer: Lecturer;
  onLogout: () => void;
  onOpenAttendance: (lecture: string) => void;
}

const LecturerDashboard = ({
  lecturer,
  onLogout,
  onOpenAttendance,
}: LecturerDashboardProps) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Load attendance records from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("attendanceRecords");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      const records = parsed.map((r: any) => ({
        ...r,
        date: new Date(r.date),
      }));
      setAttendanceRecords(records);
    } else {
      // Generate initial mock data for demonstration
      const mockRecords: AttendanceRecord[] = lecturer.lectures.map((lecture, index) => {
        const enrolledStudents = mockEnrolledStudents.default;
        const attendedCount = Math.floor(Math.random() * 3) + 5; // 5-7 students attended
        
        return {
          id: `record-${index}`,
          lectureId: lecture,
          lectureName: lecture,
          date: new Date(Date.now() - index * 24 * 60 * 60 * 1000), // Previous days
          attendedStudents: enrolledStudents.slice(0, attendedCount),
          absentStudents: enrolledStudents.slice(attendedCount),
          cameraStatus: 'closed' as 'open' | 'closed',
        };
      });
      setAttendanceRecords(mockRecords);
      localStorage.setItem("attendanceRecords", JSON.stringify(mockRecords));
    }
  }, [lecturer.lectures]);

  const handleToggleCamera = (recordId: string) => {
    setAttendanceRecords((prev) => {
      const updated: AttendanceRecord[] = prev.map((record) => {
        if (record.id === recordId) {
          const newStatus: 'open' | 'closed' = record.cameraStatus === 'open' ? 'closed' : 'open';
          
          if (newStatus === 'open') {
            toast({
              title: "Camera Activated",
              description: `Face detection started for ${record.lectureName}`,
            });
            onOpenAttendance(record.lectureName);
          } else {
            toast({
              title: "Camera Deactivated",
              description: `Attendance tracking stopped for ${record.lectureName}`,
            });
          }
          
          return { ...record, cameraStatus: newStatus };
        }
        return record;
      });
      localStorage.setItem("attendanceRecords", JSON.stringify(updated));
      return updated;
    });
  };

  // Calculate overall stats
  const totalAttended = attendanceRecords.reduce((sum, r) => sum + r.attendedStudents.length, 0);
  const totalAbsent = attendanceRecords.reduce((sum, r) => sum + r.absentStudents.length, 0);
  const totalSessions = attendanceRecords.length;
  const avgAttendance = totalSessions > 0 
    ? Math.round((totalAttended / (totalAttended + totalAbsent)) * 100) 
    : 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-primary text-transparent bg-clip-text">
              Welcome back, {lecturer.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Lecturer ID: {lecturer.lecturerId}
            </p>
          </div>
          <Button onClick={onLogout} variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Total Lectures
              </CardDescription>
              <CardTitle className="text-3xl">{lecturer.lectures.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Sessions Held
              </CardDescription>
              <CardTitle className="text-3xl">{totalSessions}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Total Attended
              </CardDescription>
              <CardTitle className="text-3xl text-success">{totalAttended}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg Attendance
              </CardDescription>
              <CardTitle className="text-3xl text-accent">{avgAttendance}%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Attendance Records */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Attendance Records
          </h2>
          
          {attendanceRecords.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {attendanceRecords.map((record) => (
                <AttendanceRecordCard
                  key={record.id}
                  record={record}
                  onToggleCamera={handleToggleCamera}
                />
              ))}
            </div>
          ) : (
            <Card className="shadow-card border-border/50">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No attendance records yet. Start your first session!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
