import { Button } from "@/components/ui/button";
import { LogOut, GraduationCap } from "lucide-react";

interface NavbarProps {
  lecturerName?: string;
  studentName?: string;
  onLogout?: () => void;
}

export default function Navbar({ lecturerName, studentName, onLogout }: NavbarProps) {
  return (
    <nav className="border-b border-primary/10 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FaceTrack
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {(lecturerName || studentName) && (
              <span className="text-sm text-muted-foreground">
                {lecturerName ? `Lecturer: ${lecturerName}` : `Student: ${studentName}`}
              </span>
            )}
            {onLogout && (
              <Button variant="outline" onClick={onLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
