import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import axios from '../../../../plugin/axios';
import { Loader2 } from 'lucide-react';

interface SemesterRenameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: (oldName: string, newName: string) => void;
    semesterId: number | null;
    initialData: string;
}

const yearLevelOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const semesterOptions = ["1st Semester", "2nd Semester", "Summer"];

export function SemesterRenameModal({ isOpen, onClose, onSaveSuccess, semesterId, initialData }: SemesterRenameModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [yearPart, setYearPart] = useState('');
    const [semesterPart, setSemesterPart] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
            const parts = initialData.split(', ');
            if (parts.length === 2) {
                setYearPart(parts[0]);
                setSemesterPart(parts[1]);
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newName = `${yearPart}, ${semesterPart}`;
        if (!yearPart || !semesterPart) { toast.error("Please select both a year level and a semester."); return; }
        if (newName === initialData) { toast.info("No changes were made."); onClose(); return; }
        if (!semesterId) { toast.error("Semester ID is missing."); return; }

        setIsSaving(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) { toast.error("Authentication required."); setIsSaving(false); return; }
            const payload = { year_level: yearPart, semester_level: semesterPart };
            await axios.put(`/semesters/${semesterId}/rename`, payload, { headers: { 'Authorization': `Bearer ${token}` } });
            toast.success("Semester renamed successfully!");
            onSaveSuccess(initialData, newName);
            onClose();
        } catch (error: any) { toast.error(error.response?.data?.message || "Failed to rename semester."); } 
        finally { setIsSaving(false); }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Semester</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="yearPart">Year Level</Label>
                        <Select value={yearPart} onValueChange={setYearPart}>
                            <SelectTrigger id="yearPart"><SelectValue placeholder="Select a year level" /></SelectTrigger>
                            <SelectContent>{yearLevelOptions.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="semesterPart">Semester</Label>
                        <Select value={semesterPart} onValueChange={setSemesterPart}>
                            <SelectTrigger id="semesterPart"><SelectValue placeholder="Select a semester" /></SelectTrigger>
                            <SelectContent>{semesterOptions.map(sem => <SelectItem key={sem} value={sem}>{sem}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className='pt-4'>
                        <DialogClose asChild><Button type="button" variant="outline" disabled={isSaving}>Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isSaving || !yearPart || !semesterPart}>
                            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Renaming...</> : 'Rename'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}