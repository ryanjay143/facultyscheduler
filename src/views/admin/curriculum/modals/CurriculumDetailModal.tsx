import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Edit, Trash2, Plus, SlidersHorizontal } from "lucide-react";
import type { Program, Subject, Semester } from '../types';
import type { JSX } from "react";
import { useState, useEffect } from 'react';
import axios from '../../../../plugin/axios';
import { toast } from 'sonner';

interface CurriculumDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    program: Program;
    onAddSemester: () => void;
    onEditSemester: (semesterId: number, semesterName: string) => void;
    onDeleteSemester: (semesterName: string) => void;
    onAddSubject: (semester: string, semesterId?: number) => void;
    onEditSubject: (semester: string, subject: Subject) => void;
    onDeleteSubject: (semester: string, subjectId?: number) => void;
    onSetSemesterStatus: (semesterName: string, semesterData: Semester) => void;
    refreshKey?: number;
    refreshSemesterName?: string | null;
}

export function CurriculumDetailModal({
    isOpen,
    onClose,
    program,
    onAddSemester,
    onEditSemester,
    onAddSubject,
    onEditSubject,
    onDeleteSubject,
    onSetSemesterStatus,
    refreshKey,
    refreshSemesterName
}: CurriculumDetailModalProps): JSX.Element {
    const [semesters, setSemesters] = useState<{ [key: string]: Semester }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!isOpen) return;

        const fetchSemesters = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Authentication required.');
                return;
            }
            setIsLoading(true);
            try {
                const response = await axios.get('/semester-with-subjects', {
                    params: { program_id: program.id },
                    headers: { Authorization: `Bearer ${token}` }
                });

                const apiSemesters: any[] = Array.isArray(response.data.semesters) ? response.data.semesters : [];
                const programSemesters: { [key: string]: Semester } = {};

                apiSemesters.forEach(apiSemester => {
                    const semesterKey = `${apiSemester.year_level}, ${apiSemester.semester_level}`;
                    programSemesters[semesterKey] = {
                        id: apiSemester.id,
                        subjects: (apiSemester.subjects || []).map((sub: any): Subject => ({
                            id: sub.id,
                            code: sub.subject_code,
                            name: sub.des_title,
                            unitsTotal: sub.total_units,
                            unitsLec: sub.lec_units,
                            unitsLab: sub.lab_units,
                            hoursTotal: sub.total_hrs,
                            hoursLec: sub.total_lec_hrs,
                            hoursLab: sub.total_lab_hrs,
                            prerequisite: sub.pre_requisite || 'None'
                        })),
                        isActive: apiSemester.status === 0,
                        startDate: apiSemester.start_date,
                        endDate: apiSemester.end_date
                    };
                });
                // If a specific semester name was requested to refresh, only merge that semester
                if (refreshSemesterName) {
                    const refreshed = programSemesters[refreshSemesterName];
                    if (refreshed) {
                        setSemesters(prev => ({ ...prev, [refreshSemesterName]: refreshed }));
                    } else {
                        // If server did not return the semester, fall back to replacing all
                        setSemesters(programSemesters);
                    }
                } else {
                    setSemesters(programSemesters);
                }
            } catch (error) {
                toast.error('Failed to load semester data.');
                console.error('Failed fetching semesters:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSemesters();
    }, [isOpen, program.id, refreshKey]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[95vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-4 bg-muted/50 border-b rounded-t-lg">
                    <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        {program.name}
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{program.abbreviation}</span>
                    </DialogTitle>
                    <DialogDescription>Academic Year of Effectivity: {program.effectiveYear}</DialogDescription>
                </DialogHeader>

                <div className="flex-grow overflow-y-auto px-6 py-4 space-y-8">
                    {isLoading ? (
                        <div className="space-y-6">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-card border rounded-xl p-4 animate-pulse">
                                    <div className="h-6 bg-muted/60 rounded w-1/3 mb-4" />
                                    <div className="h-48 bg-muted/30 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : Object.keys(semesters).length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground flex flex-col items-center justify-center h-full">
                            <Layers size={56} className="mx-auto mb-4" />
                            <h4 className="font-semibold text-xl text-foreground">No Semesters Found</h4>
                            <p className="max-w-md mx-auto mt-2 text-sm">This curriculum is empty. Start by adding a semester.</p>
                            <Button onClick={onAddSemester} className="mt-6"><Layers size={16} className="mr-2"/> Add Year/Semester</Button>
                        </div>
                    ) : (
                        Object.entries(semesters).map(([semesterName, semesterData]) => (
                            <div key={semesterName} className={`group/semester border rounded-xl overflow-hidden shadow-sm transition-opacity ${!semesterData.isActive ? 'opacity-70 bg-muted/20' : 'bg-card'}`}>
                                <div className="flex justify-between items-center p-4 bg-muted/30 border-b">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-lg font-semibold text-foreground">{semesterName}</h4>
                                        <Badge variant={semesterData.isActive ? 'default' : 'destructive'}>
                                            {semesterData.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover/semester:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" title="Set Status & Dates" className="h-8 w-8 text-muted-foreground" onClick={() => onSetSemesterStatus(semesterName, semesterData)}>
                                            <SlidersHorizontal size={16}/>
                                        </Button>
                                        <Button variant="ghost" size="icon" title="Rename Semester" className="h-8 w-8 text-green-500 hover:text-green-500" onClick={() => onEditSemester(semesterData.id!, semesterName)}><Edit size={16}/></Button>
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
                                                <TableHead rowSpan={2} className="align-middle w-[50px]"></TableHead>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead className="text-center border-r">Total</TableHead>
                                                <TableHead className="text-center border-r">Lec</TableHead>
                                                <TableHead className="text-center border-r">Lab</TableHead>
                                                <TableHead className="text-center border-r">Total</TableHead>
                                                <TableHead className="text-center border-r">Lec</TableHead>
                                                <TableHead className="text-center border-r">Lab</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {semesterData.subjects.length > 0 ? semesterData.subjects.map((subject) => (
                                                <TableRow key={subject.code}>
                                                    <TableCell className="w-[150px] font-semibold uppercase text-center">{subject.code}</TableCell>
                                                    <TableCell className="text-center">{subject.name}</TableCell>
                                                    <TableCell className="text-center font-bold text-primary">{subject.unitsTotal}</TableCell>
                                                    <TableCell className="text-center">{subject.unitsLec}</TableCell>
                                                    <TableCell className="text-center">{subject.unitsLab}</TableCell>
                                                    <TableCell className="text-center font-bold text-primary">{subject.hoursTotal}</TableCell>
                                                    <TableCell className="text-center">{subject.hoursLec}</TableCell>
                                                    <TableCell className="text-center">{subject.hoursLab}</TableCell>
                                                    <TableCell className="w-[150px] text-center">{subject.prerequisite}</TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-end">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-500" onClick={() => onEditSubject(semesterName, subject)} disabled={!semesterData.isActive}><Edit size={16}/></Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDeleteSubject(semesterName, subject.id)} disabled={!semesterData.isActive}><Trash2 size={16}/></Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={10} className="text-center h-24 text-muted-foreground">No subjects added for this semester.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                        <TableFooter className="sticky bottom-0 bg-muted/80 backdrop-blur-sm">
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-right font-bold text-lg">SEMESTER TOTALS</TableCell>
                                                <TableCell className="text-center font-bold text-lg text-primary">{semesterData.subjects.reduce((t, s) => t + s.unitsTotal, 0)}</TableCell>
                                                <TableCell className="text-center font-semibold">{semesterData.subjects.reduce((t, s) => t + s.unitsLec, 0)}</TableCell>
                                                <TableCell className="text-center font-semibold">{semesterData.subjects.reduce((t, s) => t + s.unitsLab, 0)}</TableCell>
                                                <TableCell className="text-center font-bold text-lg text-primary">{semesterData.subjects.reduce((t, s) => t + s.hoursTotal, 0)}</TableCell>
                                                <TableCell className="text-center font-semibold">{semesterData.subjects.reduce((t, s) => t + s.hoursLec, 0)}</TableCell>
                                                <TableCell className="text-center font-semibold">{semesterData.subjects.reduce((t, s) => t + s.hoursLab, 0)}</TableCell>
                                                <TableCell colSpan={2}></TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                                <div className="p-2 border-t">
                                    <Button onClick={() => onAddSubject(semesterName, semesterData.id)} variant="link" disabled={!semesterData.isActive}><Plus size={16} className="mr-1"/> Add Subject</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                 <DialogFooter className="mt-auto p-6 bg-gray-50 border-t rounded-b-lg">
                    <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                    <Button onClick={onAddSemester} variant="outline" className="flex items-center gap-2">
                        <Layers size={16}/> Add Year/Semester
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}