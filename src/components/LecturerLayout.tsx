import { ReactNode } from "react";
import { BookOpen, Users, Camera, BarChart, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LecturerLayoutProps {
  children: ReactNode;
  currentPage: "dashboard" | "courses" | "students" | "attendance" | "stats";
  onNavigate: (page: "dashboard" | "courses" | "students" | "attendance" | "stats") => void;
  onLogout: () => void;
}

export default function LecturerLayout({ children, currentPage, onNavigate, onLogout }: LecturerLayoutProps) {
  const menuItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: Menu },
    { id: "courses" as const, label: "Manage Courses", icon: BookOpen },
    { id: "students" as const, label: "Manage Students", icon: Users },
    { id: "attendance" as const, label: "Students Attendance", icon: BarChart },
    { id: "stats" as const, label: "Take Attendance", icon: Camera },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            <h1 className="text-xl font-bold">Attendance</h1>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-3">Navigation</p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
