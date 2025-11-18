import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AttendanceRecord {
  id: string;
  lectureName: string;
  date: Date;
  status: "present" | "absent";
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export default function AttendanceTable({ records }: AttendanceTableProps) {
  return (
    <div className="rounded-md border border-primary/10">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Date</TableHead>
            <TableHead>Lecture</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">
                {format(record.date, "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{record.lectureName}</TableCell>
              <TableCell>
                <Badge 
                  variant={record.status === "present" ? "default" : "destructive"}
                  className={record.status === "present" ? "bg-accent/20 text-accent hover:bg-accent/30" : ""}
                >
                  {record.status === "present" ? "✓ Present" : "✗ Absent"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
