import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import AttendanceTable from "@/components/AttendanceTable";
import { Calendar, CheckCircle2, XCircle, User, GraduationCap } from "lucide-react";

interface StudentDashboardProps {
  student: any;
  onLogout: () => void;
}

export default function StudentDashboard({ student, onLogout }: StudentDashboardProps) {

  const mockAttendance = [
    { id: "1", lectureName: "AI 101", date: new Date("2024-01-15"), status: "present" as const },
    { id: "2", lectureName: "Data Science 202", date: new Date("2024-01-14"), status: "present" as const },
    { id: "3", lectureName: "Machine Learning 303", date: new Date("2024-01-13"), status: "absent" as const },
    { id: "4", lectureName: "AI 101", date: new Date("2024-01-12"), status: "present" as const },
    { id: "5", lectureName: "Data Science 202", date: new Date("2024-01-11"), status: "present" as const },
  ];

  const totalSessions = mockAttendance.length;
  const presentCount = mockAttendance.filter(a => a.status === "present").length;
  const attendanceRate = Math.round((presentCount / totalSessions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar studentName={student.name} onLogout={onLogout} />
      
      <div className="container mx-auto p-6 space-y-6">
        <Card className="bg-gradient-card border-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                  {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {student.name}
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    Student ID: {student.studentId}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    ✓ Face Registered
                  </Badge>
                  <Badge variant="outline">
                    {student.schedule?.length || 0} Enrolled Courses
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-card border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSessions}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{presentCount}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <XCircle className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendanceRate}%</div>
              </CardContent>
            </Card>
          </div>

        <Card className="bg-card/80 backdrop-blur-sm border-primary/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle>My Courses</CardTitle>
            </div>
            <CardDescription>Your enrolled lectures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {student.schedule?.map((lecture: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-card border border-primary/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{lecture}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-primary/10">
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Your attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceTable records={mockAttendance} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
