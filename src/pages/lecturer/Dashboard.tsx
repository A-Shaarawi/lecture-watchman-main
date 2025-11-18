import { BookOpen, Users, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardProps {
  onNavigate: (page: "courses" | "students" | "stats") => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const quickActions = [
    {
      id: "courses" as const,
      title: "Manage Courses",
      description: "Add and manage courses",
      icon: BookOpen,
      color: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    },
    {
      id: "students" as const,
      title: "Manage Students",
      description: "Add students to the system",
      icon: Users,
      color: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
    },
    {
      id: "stats" as const,
      title: "Take Attendance",
      description: "Record via camera",
      icon: Camera,
      color: "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-4xl font-bold">7</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <p className="text-sm text-muted-foreground mb-4">Get started with common tasks</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate(action.id)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
