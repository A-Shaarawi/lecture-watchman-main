import { useState } from "react";
import { BookOpen, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Course {
  id: string;
  name: string;
  courseId: string;
  studentCount: number;
}

interface ManageCoursesProps {
  onBack: () => void;
  onSelectCourse: (course: Course) => void;
}

export default function ManageCourses({ onBack, onSelectCourse }: ManageCoursesProps) {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Software Management", courseId: "C4821", studentCount: 0 },
    { id: "2", name: "Software Maintenance", courseId: "C2365", studentCount: 0 },
    { id: "3", name: "Computer Graphics", courseId: "C336e", studentCount: 0 },
  ]);
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");

  const handleAddCourse = () => {
    if (!courseName.trim() || !courseId.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const newCourse: Course = {
      id: Date.now().toString(),
      name: courseName,
      courseId: courseId,
      studentCount: 0,
    };

    setCourses([...courses, newCourse]);
    toast.success("Course added successfully");
    setCourseName("");
    setCourseId("");
    setOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Manage Courses</h1>
            <p className="text-sm text-muted-foreground">Add and manage your courses</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <p className="text-sm text-muted-foreground">Create a new course</p>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Enter course name"
                />
              </div>
              <div>
                <Label htmlFor="courseId">Course ID</Label>
                <Input
                  id="courseId"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  placeholder="Enter course ID"
                />
              </div>
              <Button onClick={handleAddCourse} className="w-full">
                Add course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {courses.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
            <p className="text-muted-foreground">Add courses manually</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelectCourse(course)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">
                      {course.courseId}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{course.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
