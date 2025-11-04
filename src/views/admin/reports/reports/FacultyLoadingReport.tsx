import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { User, Search } from "lucide-react";
import { facultyData, assignedSubjects } from "../ReportsPage"; // I-import ang data

export function FacultyLoadingReport() {
  const [facultyFilter, setFacultyFilter] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    return assignedSubjects.filter((s) => {
      const inFaculty = facultyFilter === "all" || s.assignedTo.toString() === facultyFilter;
      const q = query.trim().toLowerCase();
      const inQuery = q.length === 0 || s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
      return inFaculty && inQuery;
    });
  }, [facultyFilter, query]);

  const totalUnits = filtered.reduce((sum, s) => sum + s.units, 0);

  return (
    <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm border border-border">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search subject..." className="pl-10"/>
        </div>
        <Select value={facultyFilter} onValueChange={setFacultyFilter}>
          <SelectTrigger className="w-full md:w-56">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter by faculty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Faculty</SelectItem>
            {facultyData.map((f) => <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Subject Code</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead className="text-center">Units</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((subject) => {
              const faculty = facultyData.find((f) => f.id === subject.assignedTo);
              return (
                <TableRow key={subject.id}>
                  <TableCell className="font-semibold">{subject.code}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell className="text-muted-foreground">{faculty?.name || "Unassigned"}</TableCell>
                  <TableCell className="text-muted-foreground">{`${subject.schedule.day}, ${subject.schedule.time}`}</TableCell>
                  <TableCell className="text-center font-medium">{subject.units}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
                <TableCell colSpan={4} className="text-right font-bold">Total Units</TableCell>
                <TableCell className="text-center font-bold text-lg text-primary">{totalUnits}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}