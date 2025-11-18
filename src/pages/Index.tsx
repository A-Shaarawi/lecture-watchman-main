import { useState, useEffect } from "react";
import LecturerLogin from "./LecturerLogin";
import LecturerDashboard from "./LecturerDashboard";
import StudentRegister from "./StudentRegister";
import StudentDashboard from "./StudentDashboard";
import AttendanceScanner from "@/components/AttendanceScanner";
import { Lecturer } from "@/types/lecturer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, UserCircle, BookOpen } from "lucide-react";

type AppState = 
  | 'user-type-selection'
  | 'lecturer-login' 
  | 'lecturer-dashboard' 
  | 'lecturer-scanning'
  | 'student-register'
  | 'student-dashboard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('user-type-selection');
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<string>("");
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    // Check for existing lecturer session
    const storedLecturer = localStorage.getItem("lecturer");
    if (storedLecturer) {
      setLecturer(JSON.parse(storedLecturer));
      setAppState('lecturer-dashboard');
      return;
    }

    // Check for existing student session
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      const parsedStudent = JSON.parse(storedStudent);
      setStudent(parsedStudent);
      
      // Check if student has completed face registration
      if (parsedStudent.faceEncoding) {
        setAppState('student-dashboard');
      } else {
        setAppState('student-register');
      }
    }
  }, []);

  const handleLecturerLogin = (newLecturer: Lecturer) => {
    setLecturer(newLecturer);
    setAppState('lecturer-dashboard');
  };

  const handleStartAttendance = (lectureName: string) => {
    setSelectedLecture(lectureName);
    setAppState('lecturer-scanning');
  };

  const handleAttendanceComplete = () => {
    setAppState('lecturer-dashboard');
  };

  const handleLecturerLogout = () => {
    localStorage.removeItem("lecturer");
    setLecturer(null);
    setAppState('user-type-selection');
  };

  const handleStudentRegister = (newStudent: any) => {
    setStudent(newStudent);
    setAppState('student-dashboard');
  };

  const handleStudentLogout = () => {
    localStorage.removeItem("student");
    setStudent(null);
    setAppState('user-type-selection');
  };

  const handleUserTypeSelection = (type: 'lecturer' | 'student') => {
    if (type === 'lecturer') {
      setAppState('lecturer-login');
    } else {
      setAppState('student-register');
    }
  };

  const handleBackToSelection = () => {
    setAppState('user-type-selection');
  };

  if (appState === 'user-type-selection') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <GraduationCap className="h-20 w-20 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FaceTrack
            </h1>
            <p className="text-xl text-muted-foreground">Smart Attendance System</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="bg-card/80 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all cursor-pointer group"
              onClick={() => handleUserTypeSelection('lecturer')}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-primary rounded-full group-hover:scale-110 transition-transform">
                    <UserCircle className="h-12 w-12 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl">I'm a Lecturer</CardTitle>
                <CardDescription>Manage lectures and track attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Setup and manage lectures
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Control attendance camera
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    View attendance records
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card 
              className="bg-card/80 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all cursor-pointer group"
              onClick={() => handleUserTypeSelection('student')}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-primary rounded-full group-hover:scale-110 transition-transform">
                    <BookOpen className="h-12 w-12 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl">I'm a Student</CardTitle>
                <CardDescription>Register and track your attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Register your face once
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    View your schedule
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Track attendance history
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'lecturer-login') {
    return <LecturerLogin onLogin={handleLecturerLogin} onBack={handleBackToSelection} />;
  }

  if (appState === 'lecturer-dashboard' && lecturer) {
    return (
      <LecturerDashboard 
        lecturer={lecturer} 
        onStartAttendance={handleStartAttendance}
        onLogout={handleLecturerLogout}
      />
    );
  }

  if (appState === 'lecturer-scanning' && lecturer) {
    return (
      <AttendanceScanner
        lectureName={selectedLecture}
        onBack={handleAttendanceComplete}
      />
    );
  }

  if (appState === 'student-register') {
    return <StudentRegister onRegister={handleStudentRegister} onBack={handleBackToSelection} />;
  }

  if (appState === 'student-dashboard' && student) {
    return <StudentDashboard student={student} onLogout={handleStudentLogout} />;
  }

  return null;
};

export default Index;
