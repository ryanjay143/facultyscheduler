import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';

interface SemesterStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (semesterName: string, status: boolean, startDate: string, endDate: string) => void;
    semesterName: string | null;
    initialData: { isActive: boolean; startDate?: string; endDate?: string } | null;
}

export function SemesterStatusModal({ isOpen, onClose, onSave, semesterName, initialData }: SemesterStatusModalProps) {
    const [isActive, setIsActive] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
            setIsActive(initialData.isActive);
            setStartDate(initialData.startDate || '');
            setEndDate(initialData.endDate || '');
        } else {
            setIsActive(true);
            setStartDate('');
            setEndDate('');
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            toast.error("Please provide both a start and an end date.");
            return;
        }
        if (semesterName) {
            onSave(semesterName, isActive, startDate, endDate);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Semester Status & Dates</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Semester</Label>
                        <p className="font-semibold text-lg">{semesterName}</p>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Switch id="semester-status" checked={isActive} onCheckedChange={setIsActive} />
                        <Label htmlFor="semester-status">{isActive ? 'Active' : 'Inactive'}</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                        </div>
                    </div>
                    <DialogFooter className='pt-4'>
                        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                        <Button type="submit">Save Settings</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}