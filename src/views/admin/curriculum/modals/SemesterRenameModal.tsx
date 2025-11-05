import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import axios from '../../../../plugin/axios';
import { Loader2 } from 'lucide-react';

type SemesterRenameModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: () => void; // GI-UPDATE: Wala na'y parameters
    semesterId: number | null;
    initialData: string | null;
};

const yearLevelOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
const semesterOptions = ["1st Semester", "2nd Semester", "Summer"];

export function SemesterRenameModal({ isOpen, onClose, onSaveSuccess, semesterId, initialData }: SemesterRenameModalProps) {
    const [yearLevel, setYearLevel] = useState('');
    const [semester, setSemester] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const parts = initialData.split(',').map(p => p.trim());
                setYearLevel(parts[0] || '');
                setSemester(parts[1] || '');
            } else {
                setYearLevel('');
                setSemester('');
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!yearLevel || !semester || !semesterId) {
            toast.error("Missing required information to rename.");
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error("Authentication required.");
            return;
        }

        setIsSaving(true);
        try {
            const url = `/semesters/${semesterId}/rename`;
            const body = {
                year_level: yearLevel,
                semester_level: semester,
            };

            const response = await axios.put(url, body, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            toast.success(response.data.message || 'Semester renamed successfully!');
            
            onSaveSuccess(); // GI-UPDATE: Tawagon na lang ang onSaveSuccess nga walay parameters
            onClose();

        } catch (err: any) {
            console.error("Failed to rename semester:", err.response?.data);
            toast.error(err.response?.data?.message || 'Failed to rename semester.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Semester</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="yearLevel">Year Level</Label>
                            <Select value={yearLevel} onValueChange={setYearLevel} required>
                                <SelectTrigger id="yearLevel"><SelectValue placeholder="Select year level" /></SelectTrigger>
                                <SelectContent>{yearLevelOptions.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="semester">Semester</Label>
                            <Select value={semester} onValueChange={setSemester} required>
                                <SelectTrigger id="semester"><SelectValue placeholder="Select semester" /></SelectTrigger>
                                <SelectContent>{semesterOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="pt-6">
                        <DialogClose asChild><Button type="button" variant="outline" disabled={isSaving}>Cancel</Button></DialogClose>
                        <Button type="submit" disabled={!yearLevel || !semester || isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}