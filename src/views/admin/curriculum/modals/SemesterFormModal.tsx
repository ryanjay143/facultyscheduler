import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Subject } from '../types';
import axios from '@/plugin/axios';

// Type definition para sa props sa component
type SemesterFormProps = {
    isOpen: boolean;
    onClose: () => void;
    // onSave now receives a `created` flag to indicate whether a new semester was created
    onSave?: (semesterName: string, subjects: Subject[], created: boolean) => void;
    programId: number;
};

// Initial state para sa usa ka subject row
const initialSubjectState: Subject = { code: '', name: '', unitsTotal: 0, unitsLec: 0, unitsLab: 0, hoursTotal: 0, hoursLec: 0, hoursLab: 0, prerequisite: '' };

// Mga options para sa dropdowns
const yearLevelOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const semesterOptions = ["1st Semester", "2nd Semester", "Summer"];

export function SemesterFormModal({ isOpen, onClose, onSave, programId }: SemesterFormProps) {
    // States para sa form
    const [yearLevel, setYearLevel] = useState('');
    const [semester, setSemester] = useState('');
    const [subjects, setSubjects] = useState<Subject[]>([initialSubjectState]);
    const [isSaving, setIsSaving] = useState(false);

    // Automatic calculation sa totals sa matag row
    useEffect(() => {
        const updatedSubjects = subjects.map(s => {
            const newUnitsTotal = (Number(s.unitsLec) || 0) + (Number(s.unitsLab) || 0);
            const newHoursTotal = (Number(s.hoursLec) || 0) + (Number(s.hoursLab) || 0);
            return { ...s, unitsTotal: newUnitsTotal, hoursTotal: newHoursTotal };
        });

        // I-update lang ang state kung naay pagbag-o para malikayan ang infinite loop
        if (JSON.stringify(updatedSubjects) !== JSON.stringify(subjects)) {
            setSubjects(updatedSubjects);
        }
    }, [subjects]);

    // Memoized calculation para sa totals sa footer
    const { totalUnits, totalLecUnits, totalLabUnits, totalHours, totalLecHours, totalLabHours } = useMemo(() => {
        return subjects.reduce((acc, subject) => {
            acc.totalUnits += Number(subject.unitsTotal) || 0;
            acc.totalLecUnits += Number(subject.unitsLec) || 0;
            acc.totalLabUnits += Number(subject.unitsLab) || 0;
            acc.totalHours += Number(subject.hoursTotal) || 0;
            acc.totalLecHours += Number(subject.hoursLec) || 0;
            acc.totalLabHours += Number(subject.hoursLab) || 0;
            return acc;
        }, { totalUnits: 0, totalLecUnits: 0, totalLabUnits: 0, totalHours: 0, totalLecHours: 0, totalLabHours: 0 });
    }, [subjects]);

    // Form handlers
    const handleAddSubjectRow = () => setSubjects(prevSubjects => [...prevSubjects, initialSubjectState]);
    const handleRemoveSubjectRow = (index: number) => setSubjects(prevSubjects => prevSubjects.filter((_, i) => i !== index));
    
    const handleSubjectChange = (index: number, field: keyof Subject, value: string) => {
        setSubjects(prevSubjects =>
            prevSubjects.map((s, i) => {
                if (i === index) {
                    const isNumeric = ['unitsLec', 'unitsLab', 'hoursLec', 'hoursLab'].includes(field);
                    return { ...s, [field]: isNumeric ? (value === '' ? '' : Number(value)) : value };
                }
                return s;
            })
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!yearLevel || !semester) {
            toast.error("Please select a year level and semester.");
            return;
        }

        // Validate if subjects are filled out
        const hasEmptySubjects = subjects.some(s => !s.code || !s.name);
        if (hasEmptySubjects) {
            toast.error("Please fill out all subject codes and titles.");
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error("Authentication required. Please log in again.");
                return;
            }

            const formattedSubjects = subjects.map(subject => ({
                subject_code: subject.code,
                des_title: subject.name,
                total_units: subject.unitsTotal,
                lec_units: subject.unitsLec,
                lab_units: subject.unitsLab,
                total_hrs: subject.hoursTotal,
                total_lec_hrs: subject.hoursLec,
                total_lab_hrs: subject.hoursLab,
                pre_requisite: subject.prerequisite || null
            }));

            const payload = {
                program_id: programId,
                year_level: yearLevel,
                semester_level: semester,
                subjects: formattedSubjects
            };

            const response = await axios.post('/semester-with-subjects', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.status === 201) {
                toast.success("Semester and subjects added successfully!");
                onClose();
                if (onSave) {
                    const semesterName = `${yearLevel}, ${semester}`;
                    // created = true since this endpoint adds a new semester with subjects
                    onSave(semesterName, subjects, true);
                }
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
            } else if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to save semester and subjects. Please try again.');
            }
            console.error('Error saving semester:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // I-reset ang form kung ablihan ang modal
    useEffect(() => {
        if (isOpen) {
            setYearLevel('');
            setSemester('');
            setSubjects([initialSubjectState]);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <TooltipProvider>
            <DialogContent className="max-w-7xl h-[95vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Add New Semester and Subjects</DialogTitle>
                    <DialogDescription>Add subjects in bulk. Totals are calculated automatically.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex-grow flex flex-col min-h-0 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                            <Label htmlFor="yearLevel" className="text-base">Year Level</Label>
                            <Select value={yearLevel} onValueChange={setYearLevel} required>
                                <SelectTrigger id="yearLevel"><SelectValue placeholder="Select a year level" /></SelectTrigger>
                                <SelectContent>{yearLevelOptions.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="semester" className="text-base">Semester</Label>
                             <Select value={semester} onValueChange={setSemester} required>
                                <SelectTrigger id="semester"><SelectValue placeholder="Select a semester" /></SelectTrigger>
                                <SelectContent>{semesterOptions.map(sem => <SelectItem key={sem} value={sem}>{sem}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex-grow overflow-auto border rounded-lg">
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
                                {subjects.map((s, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="w-[150px]">
                                            <Input className='uppercase' placeholder="e.g. CS101" value={s.code} onChange={(e) => handleSubjectChange(index, 'code', e.target.value)} /></TableCell>
                                        <TableCell>
                                            <Input placeholder="e.g. Introduction to Programming" value={s.name} onChange={(e) => handleSubjectChange(index, 'name', e.target.value)} /></TableCell>
                                        <TableCell>
                                            <Tooltip><TooltipTrigger asChild>
                                                <Input type="number" value={s.unitsTotal || ''} readOnly className="text-center font-bold bg-muted/50 cursor-not-allowed" />
                                            </TooltipTrigger><TooltipContent><p>Auto-calculated from Lec and Lab units.</p></TooltipContent></Tooltip>
                                        </TableCell>
                                        <TableCell><Input min='0' type="number" value={s.unitsLec || ''} onChange={(e) => handleSubjectChange(index, 'unitsLec', e.target.value)} className="text-center" /></TableCell>
                                        <TableCell><Input min='0' type="number" value={s.unitsLab || ''} onChange={(e) => handleSubjectChange(index, 'unitsLab', e.target.value)} className="text-center" /></TableCell>
                                        <TableCell>
                                            <Tooltip><TooltipTrigger asChild>
                                                <Input type="number" value={s.hoursTotal || ''} readOnly className="text-center font-bold bg-muted/50 cursor-not-allowed" />
                                            </TooltipTrigger><TooltipContent><p>Auto-calculated from Lec and Lab hours.</p></TooltipContent></Tooltip>
                                        </TableCell>
                                        <TableCell><Input min='0' type="number" value={s.hoursLec || ''} onChange={(e) => handleSubjectChange(index, 'hoursLec', e.target.value)} className="text-center" /></TableCell>
                                        <TableCell><Input min='0' type="number" value={s.hoursLab || ''} onChange={(e) => handleSubjectChange(index, 'hoursLab', e.target.value)} className="text-center" /></TableCell>
                                        <TableCell className="w-[150px]"><Input placeholder="None" value={s.prerequisite} onChange={(e) => handleSubjectChange(index, 'prerequisite', e.target.value)} /></TableCell>
                                        <TableCell className="text-center">
                                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSubjectRow(index)} className="text-destructive h-8 w-8 shrink-0">
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter className="sticky bottom-0 bg-muted/80 backdrop-blur-sm">
                                <TableRow>
                                    <TableCell colSpan={2} className="text-right font-bold text-lg">SEMESTER TOTALS</TableCell>
                                    <TableCell className="text-center font-bold text-lg text-primary">{totalUnits}</TableCell>
                                    <TableCell className="text-center font-semibold">{totalLecUnits}</TableCell>
                                    <TableCell className="text-center font-semibold">{totalLabUnits}</TableCell>
                                    <TableCell className="text-center font-bold text-lg text-primary">{totalHours}</TableCell>
                                    <TableCell className="text-center font-semibold">{totalLecHours}</TableCell>
                                    <TableCell className="text-center font-semibold">{totalLabHours}</TableCell>
                                    <TableCell colSpan={2}></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>

                    <Button type="button" variant="outline" onClick={handleAddSubjectRow} className="mt-4 w-full sm:w-auto">
                        <Plus size={16} className="mr-2" /> Add Subject Row
                    </Button>

                    <DialogFooter className="mt-5 pt-4 border-t">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isSaving}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Curriculum"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
          </TooltipProvider>
        </Dialog>
    );
}