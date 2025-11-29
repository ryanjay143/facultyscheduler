// src/pages/Curriculum/modals/CurriculumDetailModal.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"; // Assuming you have a Drawer component from your UI library
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Edit, Trash2, Plus, SlidersHorizontal, CalendarDays } from "lucide-react";
import type { Program, Subject, Semester } from '../types';
import type { JSX } from "react";
import { useState, useEffect, useMemo } from 'react';
import axios from '../../../../plugin/axios';
import { toast } from 'sonner';

// Define the structure for elective subjects
interface ElectiveSubject {
    code: string;
    name: string;
    units: number;
    instructional: string;
}

// Data from the image for professional electives - This is hardcoded as per the example
const professionalElectives: ElectiveSubject[] = [
    { code: 'CSCC 21.1', name: 'Software Engineering 1', units: 3, instructional: 'integrated lec/lab' },
    { code: 'CSCC 36', name: 'Advanced Topics in Human Computer Interaction', units: 3, instructional: 'lecture only' },
    { code: 'CSCC 37', name: 'User Interface Design and Development', units: 3, instructional: 'integrated lec/lab' },
    { code: 'CSCC 40', name: 'Introduction to Artificial Intelligence', units: 3, instructional: 'lecture only' },
    { code: 'CSCC 44', name: 'Introduction to Data Mining', units: 3, instructional: 'integrated lec/lab' },
    { code: 'CSCC 46', name: 'Introduction to Robotics', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ISCC 11', name: 'Organization and Management Concepts', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 12', name: 'Financial Management', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 16', name: 'Technopreneurship', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 17', name: 'Electronic Commerce', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 18', name: 'Introduction to Enterprise Resource Planning', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 21.1', name: 'IS Project Management', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 22.1', name: 'Systems Analysis and Design', units: 3, instructional: 'lecture only' },
    { code: 'ISCC 31', name: 'Current Issues and Trends in Computing', units: 3, instructional: 'lecture only' },
    { code: 'ITCC 12', name: 'Platform Technologies', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 17', name: 'Advanced Systems Integration and Architecture', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 18', name: 'Advanced Integrative Programming and Technologies', units: 3, instructional: 'lec and lab' },
    { code: 'ITCC 19', name: 'Introduction to Geographic Information Systems', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 34', name: 'Contemporary Database Technologies', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 35', name: 'Advanced Web Systems and Technologies', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 36', name: 'Introduction to Cloud Computing', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 37', name: 'Data Warehousing', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 38', name: 'Parallel and Distributed Computing', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 39', name: 'IT Industry Management', units: 3, instructional: 'lecture only' },
    { code: 'ITCC 40', name: 'Web Design and Development', units: 3, instructional: 'integrated lec/lab' },
    { code: 'ITCC 41', name: 'Mobile Applications Development', units: 3, instructional: 'integrated lec/lab' },
];


interface CurriculumDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    program: Program;
    onAddSemester: () => void;
    onEditSemester: (semesterId: number, semesterName: string) => void;
    onDeleteSemester: (semesterName: string) => void;
    onAddSubject: (semester: string, semesterId?: number) => void;
    onEditSubject: (semester: string, subject: Subject) => void;
    onDeleteSubject: (semesterName: string, subjectId?: number) => void;
    onSetSemesterStatus: (semesterName: string, semesterData: Semester, effectiveYear: string) => void;
    refreshKey?: number;
    updatedSubjectData?: { semesterName: string; subject: Subject } | null;
    newSemesterData?: { name: string; semester: Semester } | null;
    updatedSemesterData?: { name: string; semester: Partial<Semester>; newName?: string } | null;
}

const sortSemesterKeys = (a: string, b: string): number => {
    const [yearA, semA] = a.split(', ');
    const [yearB, semB] = b.split(', ');
    const yearNumA = parseInt(yearA);
    const yearNumB = parseInt(yearB);
    if (yearNumA !== yearNumB) return yearNumA - yearNumB;
    if (semA?.includes('Summer')) return 1;
    if (semB?.includes('Summer')) return -1;
    if (semA?.includes('1st')) return -1;
    if (semB?.includes('1st')) return 1;
    return 0;
};

export function CurriculumDetailModal({
    isOpen, onClose, program, onAddSemester, onEditSemester,
    onAddSubject, onEditSubject, onDeleteSubject, onSetSemesterStatus,
    refreshKey, updatedSubjectData, newSemesterData, updatedSemesterData
}: CurriculumDetailModalProps): JSX.Element {
    const [semesters, setSemesters] = useState<{ [key: string]: Semester }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedElective, setSelectedElective] = useState<Subject | null>(null);

    const handleViewElectives = (subject: Subject) => {
        setSelectedElective(subject);
        setIsDrawerOpen(true);
    };

    useEffect(() => {
        if (!isOpen) return;
        const fetchSemesters = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('accessToken');
            if (!token) { toast.error('Authentication required.'); setIsLoading(false); return; }
            try {
                const response = await axios.get('/semester-with-subjects', { params: { program_id: program.id }, headers: { Authorization: `Bearer ${token}` } });
                const apiSemesters: any[] = Array.isArray(response.data.semesters) ? response.data.semesters : [];
                const programSemesters: { [key: string]: Semester } = {};
                apiSemesters.forEach(apiSem => {
                    const key = `${apiSem.year_level}, ${apiSem.semester_level}`;
                    programSemesters[key] = {
                        id: apiSem.id,
                        subjects: (apiSem.subjects || []).map((sub: any): Subject => ({
                            id: sub.id, code: sub.subject_code, name: sub.des_title,
                            unitsTotal: sub.total_units, unitsLec: sub.lec_units, unitsLab: sub.lab_units,
                            hoursTotal: sub.total_hrs, hoursLec: sub.total_lec_hrs, hoursLab: sub.total_lab_hrs,
                            prerequisite: sub.pre_requisite || 'None'
                        })),
                        isActive: apiSem.status === 1,
                        startDate: apiSem.start_date, endDate: apiSem.end_date
                    };
                });
                setSemesters(programSemesters);
            } catch (error) { toast.error('Failed to load semester data.'); }
            finally { setIsLoading(false); }
        };
        fetchSemesters();
    }, [isOpen, program.id, refreshKey]);

    useEffect(() => {
        if (updatedSubjectData) {
            const { semesterName, subject } = updatedSubjectData;
            setSemesters(prev => {
                const newSemesters = JSON.parse(JSON.stringify(prev));
                const targetSemester = newSemesters[semesterName];
                if (targetSemester) {
                    const subjectIndex = targetSemester.subjects.findIndex((s: Subject) => s.id === subject.id);
                    if (subjectIndex !== -1) targetSemester.subjects[subjectIndex] = subject;
                    else targetSemester.subjects.push(subject);
                }
                return newSemesters;
            });
        }
    }, [updatedSubjectData]);

    useEffect(() => {
        if (newSemesterData) {
            const { name, semester } = newSemesterData;
            setSemesters(prev => ({ ...prev, [name]: semester }));
        }
    }, [newSemesterData]);
    
    useEffect(() => {
        if (updatedSemesterData) {
            const { name, semester, newName } = updatedSemesterData;
            setSemesters(prev => {
                const newSemesters = { ...prev };
                const targetSemester = newSemesters[name];
                if (!targetSemester) return prev;
                if (newName && newName !== name) {
                    newSemesters[newName] = { ...targetSemester, ...semester };
                    delete newSemesters[name];
                } else {
                    newSemesters[name] = { ...targetSemester, ...semester };
                }
                return newSemesters;
            });
        }
    }, [updatedSemesterData]);

    const sortedSemesters = useMemo(() => {
        return Object.entries(semesters).sort(([keyA], [keyB]) => sortSemesterKeys(keyA, keyB));
    }, [semesters]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[95vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-4 bg-muted/50 border-b rounded-t-lg">
                    <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">{program.name}<span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{program.abbreviation}</span></DialogTitle>
                    <DialogDescription className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />Academic Year of Effectivity: {program.effectiveYear}</DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto px-6 py-4 space-y-8">
                    {isLoading ? ( <div className="space-y-6">{[1, 2].map(i => (<div key={i} className="bg-card border rounded-xl p-4 animate-pulse"><div className="h-6 bg-muted/60 rounded w-1/3 mb-4" /><div className="h-48 bg-muted/30 rounded" /></div>))}</div>) 
                    : sortedSemesters.length === 0 ? (<div className="text-center py-20 text-muted-foreground flex flex-col items-center justify-center h-full"><Layers size={56} className="mx-auto mb-4" /><h4 className="font-semibold text-xl text-foreground">No Semesters Found</h4><p className="max-w-md mx-auto mt-2 text-sm">This curriculum is empty.</p></div>) 
                    : (sortedSemesters.map(([semesterName, semesterData]) => (
                            <div key={semesterName} className={`group/semester border rounded-xl overflow-hidden shadow-sm transition-opacity ${!semesterData.isActive ? 'opacity-70 bg-muted/20' : 'bg-card'}`}>
                                <div className="flex justify-between items-center p-4 bg-muted/30 border-b">
                                    <div className="flex items-center gap-3"><h4 className="text-lg font-semibold text-foreground">{semesterName}</h4><Badge variant={semesterData.isActive ? 'default' : 'destructive'}>{semesterData.isActive ? 'Active' : 'Inactive'}</Badge></div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover/semester:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" title="Set Status & Dates" className="h-8 w-8 text-muted-foreground" onClick={() => onSetSemesterStatus(semesterName, semesterData, program.effectiveYear)}><SlidersHorizontal size={16}/></Button>
                                        <Button variant="ghost" size="icon" title="Rename Semester" className="h-8 w-8 text-green-500 hover:text-green-500" onClick={() => onEditSemester(semesterData.id, semesterName)}><Edit size={16}/></Button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <Table className="min-w-[1200px]">
                                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                            <TableRow>
                                                <TableHead rowSpan={2} className="align-middle text-center border-r">Course Code</TableHead>
                                                <TableHead rowSpan={2} className="align-middle text-center border-r w-[350px]">Descriptive Title</TableHead>
                                                <TableHead colSpan={3} className="text-center border-r">Units</TableHead>
                                                <TableHead colSpan={3} className="text-center border-r">Hours per week</TableHead>
                                                <TableHead rowSpan={2} className="align-middle text-center border-r">Pre-requisite</TableHead>
                                                <TableHead rowSpan={2} className="align-middle w-[100px] text-center">Actions</TableHead>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead className="text-center border-r">Total</TableHead><TableHead className="text-center border-r">Lec</TableHead><TableHead className="text-center border-r">Lab</TableHead>
                                                <TableHead className="text-center border-r">Total</TableHead><TableHead className="text-center border-r">Lec</TableHead><TableHead className="text-center border-r">Lab</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {semesterData.subjects.length > 0 ? semesterData.subjects.map((subject) => {
                                                const isProfessionalElective = subject.name.toUpperCase().startsWith("PROFESSIONAL ELECTIVE") && subject.code.toUpperCase().startsWith("ELECTIVE");
                                                return (
                                                    <TableRow key={subject.id || subject.code}>
                                                        <TableCell className="w-[150px] font-semibold uppercase text-center">{subject.code}</TableCell>
                                                        <TableCell>
                                                            {isProfessionalElective ? (
                                                                <Button 
                                                                    variant="link" 
                                                                    className="text-left p-0 h-auto font-normal text-base text-blue-600 hover:underline" 
                                                                    onClick={() => handleViewElectives(subject)}
                                                                >
                                                                    {subject.name}
                                                                </Button>
                                                            ) : (
                                                                subject.name
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center font-bold text-primary">{subject.unitsTotal}</TableCell>
                                                        <TableCell className="text-center">{subject.unitsLec}</TableCell>
                                                        <TableCell className="text-center">{subject.unitsLab}</TableCell>
                                                        <TableCell className="text-center font-bold text-primary">{subject.hoursTotal}</TableCell>
                                                        <TableCell className="text-center">{subject.hoursLec}</TableCell>
                                                        <TableCell className="text-center">{subject.hoursLab}</TableCell>
                                                        <TableCell className="w-[150px] text-center">{subject.prerequisite}</TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex justify-end items-center gap-1">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-500" onClick={() => onEditSubject(semesterName, subject)}><Edit size={16} /></Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDeleteSubject(semesterName, subject.id)}><Trash2 size={16} /></Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }) : (<TableRow><TableCell colSpan={10} className="text-center h-24 text-muted-foreground">No subjects added for this semester.</TableCell></TableRow>)}
                                        </TableBody>
                                        <TableFooter className="sticky bottom-0 bg-muted/80 backdrop-blur-sm">
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-right font-bold text-lg">SEMESTER TOTALS</TableCell>
                                                <TableCell className="text-center font-bold text-lg text-primary">{semesterData.subjects.reduce((t, s) => t + (Number(s.unitsTotal) || 0), 0)}</TableCell>
                                                <TableCell className="text-center font-semibold">{semesterData.subjects.reduce((t, s) => t + (Number(s.unitsLec) || 0), 0)}</TableCell>
                                                <TableCell className="text-center font-semibold">{semesterData.subjects.reduce((t, s) => t + (Number(s.unitsLab) || 0), 0)}</TableCell>
                                                <TableCell className="text-center font-bold text-lg text-primary">{semesterData.subjects.reduce((t, s) => t + (Number(s.hoursTotal) || 0), 0)}</TableCell>
                                                <TableCell className="text-center font-semibold">{semesterData.subjects.reduce((t, s) => t + (Number(s.hoursLec) || 0), 0)}</TableCell>
                                                <TableCell className="text-center font-semibold">{semesterData.subjects.reduce((t, s) => t + (Number(s.hoursLab) || 0), 0)}</TableCell>
                                                <TableCell colSpan={2}></TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                                <div className="p-2 border-t"><Button onClick={() => onAddSubject(semesterName, semesterData.id)} variant="link"><Plus size={16} className="mr-1"/> Add Subject</Button></div>
                            </div>
                        ))
                    )}
                </div>
                <DialogFooter className="mt-auto p-6 bg-gray-50 border-t rounded-b-lg flex flex-col md:flex-row md:justify-end gap-2">
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={onAddSemester} className="flex items-center gap-2"><Layers size={16}/> Add Year/Semester</Button>
                </DialogFooter>
            </DialogContent>

            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
  <DrawerContent className="p-0">
    <DrawerHeader className="text-left px-5 py-4 border-b">
      <div className="flex items-center justify-between">
        <div>
          <DrawerTitle className="text-base md:text-lg">
            {selectedElective?.name || "Elective Subjects"}
          </DrawerTitle>
          <DrawerDescription className="text-xs md:text-sm">
            The following subjects can be taken for this elective.
          </DrawerDescription>
        </div>
        <Badge variant="secondary" className="ml-2">
          {professionalElectives.length} items
        </Badge>
      </div>
    </DrawerHeader>

    <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
      <Table className="min-w-[720px]">
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow className="[&>th]:py-2 [&>th]:text-xs">
            <TableHead className="w-[140px]">Course Code</TableHead>
            <TableHead className="w-[420px]">Descriptive Title</TableHead>
            <TableHead className="text-right w-[80px]">Units</TableHead>
            <TableHead className="w-[200px]">Instructional</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionalElectives.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No elective subjects available.
              </TableCell>
            </TableRow>
          ) : (
            professionalElectives.map((subject) => (
              <TableRow
                key={subject.code}
                className="hover:bg-muted/40 transition-colors [&>td]:py-2 text-sm"
              >
                <TableCell className="font-semibold">{subject.code}</TableCell>
                <TableCell title={subject.name} className="truncate">
                  <span className="line-clamp-1">{subject.name}</span>
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">{subject.units}</TableCell>
                <TableCell className="text-muted-foreground">{subject.instructional}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        {professionalElectives.length > 0 && (
          <TableFooter className="bg-muted/40">
            <TableRow className="[&>td]:py-2">
              <TableCell colSpan={2} className="text-right font-medium text-sm">
                Total Units
              </TableCell>
              <TableCell className="text-right font-semibold">
                {professionalElectives.reduce((t, s) => t + (Number(s.units) || 0), 0)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>

    <DrawerFooter className="px-5 py-3 border-t">
      <DrawerClose asChild>
        <Button variant="outline" size="sm">Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
        </Dialog>
    );
}