import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import axios from '../../../../plugin/axios';
import { Loader2 } from 'lucide-react';
import type { Semester } from '../types';

interface SemesterStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: (semesterName: string, updatedData: Partial<Semester>) => void;
    semesterId: number | null;
    semesterName: string;
    initialData: { isActive: boolean; startDate?: string; endDate?: string } | null;
}

export function SemesterStatusModal({ isOpen, onClose, onSaveSuccess, semesterId, semesterName, initialData }: SemesterStatusModalProps) {
    const [isActive, setIsActive] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setIsActive(initialData.isActive);
                // Gibag-o nga function aron ma-format ang petsa ngadto sa MM-dd-yyyy
                const formatToMmDdYyyy = (dateString?: string) => {
                    if (!dateString) return '';
                    const date = new Date(dateString);
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    const year = date.getFullYear();
                    return `${month}-${day}-${year}`;
                };
                setStartDate(formatToMmDdYyyy(initialData.startDate));
                setEndDate(formatToMmDdYyyy(initialData.endDate));
            } else {
                setIsActive(false);
                setStartDate('');
                setEndDate('');
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!semesterId) { toast.error("Semester ID is missing."); return; }
        if (isActive && (!startDate || !endDate)) { toast.error("Start and end dates are required when semester is Active."); return; }
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) { toast.error("Start date cannot be after the end date."); return; }
        
        const token = localStorage.getItem('accessToken');
        if (!token) { toast.error("Authentication required."); return; }

        setIsSaving(true);
        try {
            const url = `/semesters/${semesterId}/status`;
            // I-convert balik sa YYYY-MM-DD sa dili pa ipadala sa backend kon gikinahanglan
            const toApiFormat = (dateString: string) => dateString ? new Date(dateString).toISOString().split('T')[0] : null;

            const body = { 
                status: isActive ? 1 : 0, 
                start_date: toApiFormat(startDate), 
                end_date: toApiFormat(endDate),
            };
            const response = await axios.put(url, body, { headers: { 'Authorization': `Bearer ${token}` } });
            toast.success(response.data.message || 'Semester status updated!');
            onSaveSuccess(semesterName, {
                isActive: isActive,
                startDate: startDate || undefined,
                endDate: endDate || undefined
            });
            onClose();
        } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to update semester.'); } 
        finally { setIsSaving(false); }
    };

    // Siguroha nga ang input type="date" magpabilin aron magamit ang date picker sa browser
    // Ang pagpakita sa format magdepende sa locale sa browser, apan ang value ipasa sa husto.
    // Kon gusto nimo og custom display format, kinahanglan nimo og custom date picker component.
    const toInputFormat = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>Set Semester Status & Dates</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2"><Label>Semester</Label><p className="font-semibold text-lg">{semesterName}</p></div>
                    <div className="flex items-center space-x-2 pt-2"><Switch id="semester-status" checked={isActive} onCheckedChange={setIsActive} /><Label htmlFor="semester-status" className="cursor-pointer">{isActive ? 'Active' : 'Inactive'}</Label></div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2"><Label htmlFor="startDate">Start Date</Label><Input id="startDate" type="date" value={toInputFormat(startDate)} onChange={e => setStartDate(e.target.value)} required={isActive} /></div>
                        <div className="space-y-2"><Label htmlFor="endDate">End Date</Label><Input id="endDate" type="date" value={toInputFormat(endDate)} onChange={e => setEndDate(e.target.value)} required={isActive} /></div>
                    </div>
                    <DialogFooter className='pt-4'>
                        <DialogClose asChild><Button type="button" variant="outline" disabled={isSaving}>Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isSaving}>{isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Settings'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}