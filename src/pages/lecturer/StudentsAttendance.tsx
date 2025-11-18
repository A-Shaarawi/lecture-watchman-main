import { useState } from "react";
import { ArrowLeft, Users as UsersIcon, Check, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StudentsAttendanceProps {
  onBack: () => void;
}

export default function StudentsAttendance({ onBack }: StudentsAttendanceProps) {
  const [selectedCourse, setSelectedCourse] = useState("cg");
  const [selectedGroup, setSelectedGroup] = useState("se3");
  const [selectedDate, setSelectedDate] = useState("2025-10-19");

  const students = [
    { id: "1", studentId: "FCI2005", name: "Youssef Mysara", status: "Absent" as const },
    { id: "2", studentId: "FCI2005", name: "Youssef Mysara", status: "Present" as const },
    { id: "3", studentId: "FCI2005", name: "Youssef Mysara", status: "Present" as const },
    { id: "4", studentId: "FCI2005", name: "Youssef Mysara", status: "Absent" as const },
    { id: "5", studentId: "FCI2005", name: "Youssef Mysara", status: "Present" as const },
    { id: "6", studentId: "FCI2005", name: "Youssef Mysara", status: "Present" as const },
  ];

  const totalStudents = students.length;
  const presentCount = students.filter((s) => s.status === "Present").length;
  const absentCount = students.filter((s) => s.status === "Absent").length;

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Students Attendance</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage student attendance across different groups</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">course:</span>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cg">Computer Graphics</SelectItem>
              <SelectItem value="sm">Software Management</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <UsersIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Group:</span>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="se3">Se3</SelectItem>
              <SelectItem value="se1">Se1</SelectItem>
              <SelectItem value="se2">Se2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <UsersIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-2xl font-bold">{presentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center">
                <X className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold">{absentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">SE3 - Attendance Details</h2>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={student.status === "Present" ? "default" : "destructive"}
                      className={student.status === "Present" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                    >
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
