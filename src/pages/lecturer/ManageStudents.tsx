import { useState } from "react";
import { ArrowLeft, Plus, Users, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ManageStudentsProps {
  onBack: () => void;
}

export default function ManageStudents({ onBack }: ManageStudentsProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [courseId, setCourseId] = useState("");

  const handleAddStudent = () => {
    if (!studentName.trim() || !studentId.trim() || !studentGroup.trim() || !courseId.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Student added successfully");
    setStudentName("");
    setStudentId("");
    setStudentGroup("");
    setCourseId("");
    setAddOpen(false);
  };

  const handleImportExcel = () => {
    toast.success("Excel import functionality coming soon");
    setImportOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Manage Students</h1>
        </div>
        <div className="flex gap-2">
          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500">
                <Plus className="w-4 h-4" />
                Import Excel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Excel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="group">Group</Label>
                  <Input
                    id="group"
                    placeholder="Enter group"
                  />
                </div>
                <div>
                  <Label htmlFor="importCourseId">Course ID</Label>
                  <Input
                    id="importCourseId"
                    placeholder="Select course"
                  />
                </div>
                <Button onClick={handleImportExcel} className="w-full bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Import Excel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
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
                  <Label htmlFor="addStudentName">Student Name</Label>
                  <Input
                    id="addStudentName"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <Label htmlFor="addStudentId">Student ID</Label>
                  <Input
                    id="addStudentId"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter student ID"
                  />
                </div>
                <div>
                  <Label htmlFor="addStudentGroup">Student Group</Label>
                  <Input
                    id="addStudentGroup"
                    value={studentGroup}
                    onChange={(e) => setStudentGroup(e.target.value)}
                    placeholder="Enter student group"
                  />
                </div>
                <div>
                  <Label htmlFor="addCourseId">Course ID</Label>
                  <Input
                    id="addCourseId"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    placeholder="Select course"
                  />
                </div>
                <Button onClick={handleAddStudent} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-12">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Users className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Students Yet</h3>
          <p className="text-muted-foreground mb-6">Add students manually or import from Excel</p>
        </div>
      </Card>
    </div>
  );
}
