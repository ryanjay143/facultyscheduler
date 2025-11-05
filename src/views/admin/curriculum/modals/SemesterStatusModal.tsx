import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import axios from '../../../../plugin/axios';
import { Loader2 } from 'lucide-react';

interface SemesterStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    semesterId: number | null;
    semesterName: string | null;
    initialData: { isActive: boolean; startDate?: string; endDate?: string } | null;
}

export function SemesterStatusModal({ isOpen, onClose, onSaveSuccess, semesterId, semesterName, initialData }: SemesterStatusModalProps) {
    const [isActive, setIsActive] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setIsActive(initialData.isActive);
            const formatToYyyyMmDd = (dateString?: string) => {
                if (!dateString) return '';
                try {
                    return new Date(dateString).toISOString().split('T')[0];
                } catch (e) {
                    return '';
                }
            };
            setStartDate(formatToYyyyMmDd(initialData.startDate));
            setEndDate(formatToYyyyMmDd(initialData.endDate));
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!semesterId) {
            toast.error("Semester ID is missing. Cannot save.");
            return;
        }

        if (!isActive) {
            if (!startDate || !endDate) {
                toast.error("Please provide both start and end dates when marking as Inactive.");
                return;
            }
            if (new Date(startDate) > new Date(endDate)) {
                toast.error("Start date cannot be after the end date.");
                return;
            }
        }
        
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error("Authentication required.");
            return;
        }

        setIsSaving(true);
        try {
            const url = `/semesters/${semesterId}/status`;
            const body: { status: number; start_date?: string; end_date?: string } = {
                status: isActive ? 0 : 1,
            };

            if (!isActive) {
                body.start_date = startDate;
                body.end_date = endDate;
            }

            const response = await axios.put(url, body, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            toast.success(response.data.message || 'Semester status updated successfully!');
            onSaveSuccess();
            onClose();

        } catch (err: any) {
            console.error("Failed to update semester:", err.response?.data);
            toast.error(err.response?.data?.message || 'Failed to update semester.');
        } finally {
            setIsSaving(false);
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
                        <Label htmlFor="semester-status" className="cursor-pointer">
                            {isActive ? 'Active' : 'Inactive'}
                        </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} disabled={isActive} required={!isActive} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={isActive} required={!isActive} />
                        </div>
                    </div>
                    <DialogFooter className='pt-4'>
                        <DialogClose asChild><Button type="button" variant="outline" disabled={isSaving}>Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Settings'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}