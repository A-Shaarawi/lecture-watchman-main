import { useState } from "react";
import { ArrowLeft, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Student {
  id: string;
  studentId: string;
  name: string;
  group: string;
  status: "Present" | "Absent";
}

interface CourseStudentsProps {
  courseName: string;
  onBack: () => void;
}

export default function CourseStudents({ courseName, onBack }: CourseStudentsProps) {
  const [students, setStudents] = useState<Student[]>([
    { id: "1", studentId: "FCI2005", name: "Youssef Mysara", group: "SE3", status: "Present" },
    { id: "2", studentId: "FCI2005", name: "Youssef Mysara", group: "SE3", status: "Present" },
    { id: "3", studentId: "FCI2005", name: "Youssef Mysara", group: "SE1", status: "Present" },
  ]);
  const [open, setOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");

  const handleAddStudent = () => {
    if (!studentName.trim() || !studentId.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      studentId: studentId,
      name: studentName,
      group: "SE3",
      status: "Absent",
    };

    setStudents([...students, newStudent]);
    toast.success("Student added successfully");
    setStudentName("");
    setStudentId("");
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
            <h1 className="text-2xl font-bold">Students List</h1>
            <p className="text-sm text-muted-foreground">Students who recorded this lecture</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter student ID"
                />
              </div>
              <Button onClick={handleAddStudent} className="w-full">
                Add Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 mb-6 p-4 bg-card rounded-lg border">
        <BookOpen className="w-5 h-5" />
        <span className="font-medium">course:</span>
        <span className="text-muted-foreground">{courseName}</span>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recorded students</h2>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.group}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">
                      {student.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
