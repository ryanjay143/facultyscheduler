import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { Info, Search } from 'lucide-react';
import type { FacultyType, Subject } from '../type';
import { COMMON_DAY_SLOTS, DAYS_ORDER } from '../data/dummyData';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

// --- Interface para sa props ---
interface AssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  faculty: FacultyType[];
  subjects: Subject[];
  onAssign: (payload: { subjectId: number; facultyName: string; day: string; startTime: string; endTime: string }) => void;
  onUnassign: (subjectId: number) => void;
}

// --- Time & Conflict Helpers ---
const to12h = (time24: string) => {
    if (!time24 || !time24.includes(':')) return time24;
    const [hStr, m] = time24.split(':');
    let h = Number(hStr);
    const suffix = h < 12 ? 'am' : 'pm';
    if (h === 0) h = 12;
    if (h > 12) h -= 12;
    return `${String(h).padStart(2, '0')}:${m}${suffix}`;
};
const formatRange12h = (start: string, end: string) => `${to12h(start)}-${to12h(end)}`;
const toMinutes = (hhmm: string) => { const [hh = 0, mm = 0] = hhmm.split(':').map(Number); return hh * 60 + mm; };
const parseRange = (range: string) => { const [s = '00:00', e = '00:00'] = range.split('-'); return { s, e, sm: toMinutes(s), em: toMinutes(e) }; };
const containsRange = (facRange: string, slotRange: string) => { const f = parseRange(facRange); const r = parseRange(slotRange); return f.sm <= r.sm && r.em <= f.em; };
const iterAssignedParts = (assignedTime: string): { day: string; start: string; end: string }[] => {
    if (!assignedTime) return [];
    return assignedTime.split(';').map(p => p.trim()).filter(Boolean).map(part => {
        const [day, range] = part.split(' ');
        const [start, end] = (range || '').split('-');
        return { day, start, end };
    }).filter(p => p.day && p.start && p.end);
};

export function AssignmentDialog({ isOpen, onClose, subject, faculty, subjects, onAssign }: AssignmentDialogProps) {
    const [facultyQuery, setFacultyQuery] = useState('');
    const [selectedFacultyName, setSelectedFacultyName] = useState<string>('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [selectedSlotRange, setSelectedSlotRange] = useState<string | null>(null);

    const eligibleFaculty = useMemo(() => faculty.filter((f) => f.expertise.includes(subject.expertise)), [faculty, subject]);
    const filteredEligibleFaculty = useMemo(() => {
        if (!facultyQuery.trim()) return eligibleFaculty;
        const q = facultyQuery.toLowerCase();
        return eligibleFaculty.filter(f => f.name.toLowerCase().includes(q));
    }, [eligibleFaculty, facultyQuery]);
    const selectedFaculty = useMemo(() => faculty.find((f) => f.name === selectedFacultyName) || null, [faculty, selectedFacultyName]);

    const loadOf = (f: FacultyType) => subjects.filter((s) => s.assigned?.faculty === f.name).length;
    
    const isSlotConflicting = (facultyName: string, day: string, start: string, end: string) => {
        const assignedForFaculty = subjects.filter((s) => s.assigned?.faculty === facultyName);
        for (const s of assignedForFaculty) {
            const parts = iterAssignedParts(s.assigned?.time || '');
            for (const part of parts) {
                if (part.day !== day) continue;
                if (start < part.end && part.start < end) return true;
            }
        }
        return false;
    };

    const dayAllowsSlot = (day: string, range: string) => {
        if (!selectedFaculty) return false;
        const facultyRanges = selectedFaculty.availability?.[day] || [];
        return facultyRanges.some((fr) => containsRange(fr, range));
    };

    const slotStats = (range: string) => {
        if (!selectedFaculty || !range) return { perDay: [], assignableDays: [], countAssignable: 0 };
        const { s: start, e: end } = parseRange(range);
        const perDay = selectedDays.map(day => {
            const allowedByFaculty = dayAllowsSlot(day, range);
            const conflict = allowedByFaculty ? isSlotConflicting(selectedFaculty.name, day, start, end) : false;
            return { day, allowedByFaculty, conflict, assignable: allowedByFaculty && !conflict };
        });
        const assignableDays = perDay.filter(d => d.assignable).map(d => d.day);
        return { perDay, assignableDays, countAssignable: assignableDays.length };
    };

    const availableCountForDay = (day: string) => {
        if (!selectedFaculty || selectedFacultyIsMaxed) return 0;
        const commonRanges = COMMON_DAY_SLOTS[day] || [];
        let count = 0;
        for (const range of commonRanges) {
            if (dayAllowsSlot(day, range)) {
                const { s, e } = parseRange(range);
                if (!isSlotConflicting(selectedFaculty.name, day, s, e)) {
                    count++;
                }
            }
        }
        return count;
    };

    const selectedFacultyLoad = selectedFaculty ? loadOf(selectedFaculty) : 0;
    const selectedFacultyIsMaxed = selectedFaculty ? selectedFacultyLoad >= selectedFaculty.maxSubjects : false;

    useEffect(() => {
        if (isOpen) {
            const firstFaculty = eligibleFaculty[0]?.name ?? '';
            setSelectedFacultyName(firstFaculty);
            setSelectedDays([]);
            setSelectedSlotRange(null);
            setFacultyQuery('');
        }
    }, [isOpen, eligibleFaculty]);
    
    const handleAssignSelected = () => {
        if (!subject || !selectedFaculty || !selectedSlotRange || selectedFacultyIsMaxed) return;
        const { s: start, e: end } = parseRange(selectedSlotRange);
        const { assignableDays } = slotStats(selectedSlotRange);
        if (assignableDays.length === 0) { toast.warning("No assignable days for the selected slot."); return; }

        let remainingCapacity = Math.max(0, selectedFaculty.maxSubjects - selectedFacultyLoad);
        for (const day of assignableDays) {
            if (remainingCapacity <= 0) break;
            onAssign({ subjectId: subject.id, facultyName: selectedFaculty.name, day, startTime: start, endTime: end });
            remainingCapacity -= 1;
        }
        onClose();
    };

    const toggleDay = (day: string) => setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Assign Subject: {subject.code} - {subject.name}</DialogTitle>
                    <DialogDescription>Select an eligible faculty, choose days, then pick a common time slot.</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0 py-4">
                    {/* Faculty List (Left Pane) */}
                    <div className="lg:col-span-1 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r pb-6 lg:pb-0 lg:pr-6">
                        <h3 className="font-semibold text-foreground">1. Select an Eligible Faculty</h3>
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                           <Input placeholder="Search eligible faculty..." value={facultyQuery} onChange={(e) => setFacultyQuery(e.target.value)} className="pl-10" />
                        </div>
                        <div className="flex-grow overflow-y-auto space-y-2 -mr-6 pr-6">
                            {filteredEligibleFaculty.length > 0 ? filteredEligibleFaculty.map((f) => {
                                const currentLoad = loadOf(f);
                                const pct = Math.min(100, Math.round((currentLoad / Math.max(1, f.maxSubjects)) * 100));
                                const selected = selectedFacultyName === f.name;
                                return (
                                    <button
                                        key={f.id} type="button"
                                        onClick={() => { setSelectedFacultyName(f.name); setSelectedDays([]); setSelectedSlotRange(null); }}
                                        className={`w-full text-left p-3 rounded-md border transition ${selected ? 'bg-primary/5 border-primary' : 'hover:border-primary/50'}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <p className="font-semibold text-foreground">{f.name}</p>
                                            <Badge variant={selected ? 'default' : 'secondary'}>{currentLoad}/{f.maxSubjects}</Badge>
                                        </div>
                                        <Progress value={pct} className="h-1.5 mt-2" />
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {f.expertise.map((e) => (<Badge key={e} variant="outline" className="text-xs">{e}</Badge>))}
                                        </div>
                                    </button>
                                );
                            }) : (
                                <div className="text-center text-sm text-muted-foreground pt-10"><Info size={24} className="mx-auto mb-2" />No faculty match your search.</div>
                            )}
                        </div>
                    </div>

                    {/* Day and Slot Selection (Right Pane) */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {!selectedFaculty ? (
                            <div className="h-full flex items-center justify-center text-muted-foreground"><Info size={24} className="mr-2"/>Select a faculty to see options.</div>
                        ) : selectedFacultyIsMaxed ? (
                            <div className="h-full flex items-center justify-center text-destructive bg-destructive/10 rounded-md p-4"><Info size={24} className="mr-2"/>This faculty has reached their maximum teaching load.</div>
                        ) : (
                            <>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">2. Choose Days</h3>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {DAYS_ORDER.map((day) => {
                                            const isActive = selectedDays.includes(day);
                                            const count = availableCountForDay(day);
                                            return (
                                                <Button key={day} variant={isActive ? "default" : "outline"} onClick={() => toggleDay(day)} className="flex items-center gap-2">
                                                    <span>{day.substring(0, 3)}</span>
                                                    <Badge variant={isActive ? "secondary" : (count > 0 ? "default" : "destructive")}>{count}</Badge>
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>
                                
                                <div className="flex-grow flex flex-col">
                                    <h3 className="font-semibold text-foreground mb-2">3. Pick a Common Time Slot</h3>
                                    <div className="flex-grow overflow-y-auto border rounded-md p-2 bg-muted/30">
                                        <div className="flex flex-wrap gap-2">
                                            {Array.from(new Set(DAYS_ORDER.flatMap(d => COMMON_DAY_SLOTS[d] || []))).sort((a, b) => parseRange(a).sm - parseRange(b).sm).map((range) => {
                                                const stats = slotStats(range);
                                                const isSelected = selectedSlotRange === range;
                                                const disabled = selectedDays.length === 0 || stats.countAssignable === 0;
                                                return (
                                                    <Button
                                                        key={range}
                                                        variant={isSelected ? "default" : "outline"}
                                                        disabled={disabled}
                                                        onClick={() => setSelectedSlotRange(range)}
                                                        className="flex items-center justify-between gap-2"
                                                        title={disabled ? 'Not available or no days selected' : `Available for ${stats.countAssignable} day(s)`}
                                                    >
                                                        <span>{formatRange12h(parseRange(range).s, parseRange(range).e)}</span>
                                                        <Badge variant={isSelected ? "secondary" : "default"}>{stats.countAssignable}/{selectedDays.length}</Badge>
                                                    </Button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter className="border-t pt-4">
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleAssignSelected} disabled={!selectedSlotRange || selectedFacultyIsMaxed || slotStats(selectedSlotRange || "")?.countAssignable === 0}>
                        Assign to {slotStats(selectedSlotRange || "")?.countAssignable || 0} Day(s)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}