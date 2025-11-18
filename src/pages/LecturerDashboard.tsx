import { useState } from "react";
import LecturerLayout from "@/components/LecturerLayout";
import Dashboard from "@/pages/lecturer/Dashboard";
import ManageCourses from "@/pages/lecturer/ManageCourses";
import CourseStudents from "@/pages/lecturer/CourseStudents";
import ManageStudents from "@/pages/lecturer/ManageStudents";
import TakeAttendance from "@/pages/lecturer/TakeAttendance";
import StudentsAttendance from "@/pages/lecturer/StudentsAttendance";
import { Lecturer } from "@/types/lecturer";

interface LecturerDashboardProps {
  lecturer: Lecturer;
  onStartAttendance: (lectureName: string) => void;
  onLogout: () => void;
}

type PageView = 
  | { type: "dashboard" }
  | { type: "courses" }
  | { type: "courseStudents"; courseName: string }
  | { type: "students" }
  | { type: "attendance" }
  | { type: "stats" };

export default function LecturerDashboard({ lecturer, onStartAttendance, onLogout }: LecturerDashboardProps) {
  const [currentView, setCurrentView] = useState<PageView>({ type: "dashboard" });

  const getCurrentPage = (): "dashboard" | "courses" | "students" | "attendance" | "stats" => {
    if (currentView.type === "courseStudents") return "courses";
    return currentView.type;
  };

  const handleNavigate = (page: "dashboard" | "courses" | "students" | "attendance" | "stats") => {
    setCurrentView({ type: page });
  };

  const renderContent = () => {
    switch (currentView.type) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={(page) => setCurrentView({ type: page })}
          />
        );
      case "courses":
        return (
          <ManageCourses
            onBack={() => setCurrentView({ type: "dashboard" })}
            onSelectCourse={(course) =>
              setCurrentView({ type: "courseStudents", courseName: course.name })
            }
          />
        );
      case "courseStudents":
        return (
          <CourseStudents
            courseName={currentView.courseName}
            onBack={() => setCurrentView({ type: "courses" })}
          />
        );
      case "students":
        return <ManageStudents onBack={() => setCurrentView({ type: "dashboard" })} />;
      case "attendance":
        return <StudentsAttendance onBack={() => setCurrentView({ type: "dashboard" })} />;
      case "stats":
        return <TakeAttendance onBack={() => setCurrentView({ type: "dashboard" })} />;
      default:
        return null;
    }
  };

  return (
    <LecturerLayout
      currentPage={getCurrentPage()}
      onNavigate={handleNavigate}
      onLogout={onLogout}
    >
      {renderContent()}
    </LecturerLayout>
  );
}
