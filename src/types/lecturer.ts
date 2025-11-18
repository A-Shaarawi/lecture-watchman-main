export interface Lecturer {
  id: string;
  name: string;
  lecturerId: string;
  lectures: string[];
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
}

export interface DetectedStudent extends Student {
  attended: boolean;
  detectedAt?: Date;
}

export interface AttendanceRecord {
  id: string;
  lectureId: string;
  lectureName: string;
  date: Date;
  attendedStudents: Student[];
  absentStudents: Student[];
  cameraStatus: 'open' | 'closed';
}

// Mock enrolled students for each lecture
export const mockEnrolledStudents: Record<string, Student[]> = {
  default: [
    { id: "1", name: "Alex Johnson", studentId: "STU-2024-001" },
    { id: "2", name: "Maria Garcia", studentId: "STU-2024-002" },
    { id: "3", name: "David Chen", studentId: "STU-2024-003" },
    { id: "4", name: "Sarah Williams", studentId: "STU-2024-004" },
    { id: "5", name: "James Brown", studentId: "STU-2024-005" },
    { id: "6", name: "Emma Davis", studentId: "STU-2024-006" },
    { id: "7", name: "Michael Wilson", studentId: "STU-2024-007" },
    { id: "8", name: "Sophia Martinez", studentId: "STU-2024-008" },
  ],
};
