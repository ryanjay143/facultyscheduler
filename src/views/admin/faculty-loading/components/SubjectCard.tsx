import { motion } from 'framer-motion';
import { ChevronRight, User, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Subject } from '../type';

interface SubjectCardProps {
    subject: Subject;
    index: number;
    onAssignClick: () => void;
    onUnassignClick: () => void;
}

// Helper para i-format ang oras
const to12h = (time24: string) => {
    if (!time24 || !time24.includes(':')) return time24;
    const [hStr, m] = time24.split(':');
    let h = Number(hStr);
    const suffix = h < 12 ? 'am' : 'pm';
    if (h === 0) h = 12;
    if (h > 12) h -= 12;
    return `${String(h).padStart(2, '0')}:${m}${suffix}`;
};

const formatAssigned12h = (assigned: string) => {
    if (!assigned) return '';
    return assigned.split(';').map(p => p.trim()).filter(Boolean).map((p) => {
        const [day, range] = p.split(' ');
        if (!range || !range.includes('-')) return p;
        const [s, e] = range.split('-');
        return `${day} ${to12h(s)}-${to12h(e)}`;
    }).join('; ');
};

export function SubjectCard({ subject, index, onAssignClick, onUnassignClick }: SubjectCardProps) {
    const isAssigned = !!subject.assigned;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="p-4 rounded-lg border bg-background transition-all hover:border-primary/50"
        >
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-semibold text-foreground">{subject.code} - {subject.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary">{subject.expertise}</Badge>
                    </div>
                    {isAssigned && subject.assigned && (
                        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5"><User size={14} className="text-green-500"/><span>Assigned to <strong>{subject.assigned.faculty}</strong></span></div>
                            <div className="flex items-center gap-1.5"><Clock size={14}/><span>{formatAssigned12h(subject.assigned.time)}</span></div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    {isAssigned && (
                        <Button variant="outline" size="sm" onClick={onUnassignClick} className="w-full sm:w-auto">
                            <XCircle size={16} className="mr-2" /> Unassign
                        </Button>
                    )}
                    <Button size="sm" onClick={onAssignClick} className="w-full sm:w-auto">
                        {isAssigned ? 'Re-assign' : 'Assign'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}