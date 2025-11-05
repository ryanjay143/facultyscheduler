import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, BookCopy, BarChart3 } from 'lucide-react';
import type { Program } from '../types';

const programColorClasses = [ 'from-purple-600 to-indigo-600', 'from-blue-500 to-teal-400', 'from-pink-500 to-rose-500', 'from-orange-500 to-amber-500', 'from-green-500 to-lime-500', 'from-cyan-500 to-sky-500' ];
const cardVariants: Variants = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }) };

interface ProgramCardProps {
    program: Program;
    index: number;
    onEdit: (program: Program) => void;
    onDelete: (programId: number) => void;
    onManage: () => void;

}

export function ProgramCard({ program, index, onEdit, onDelete, onManage }: ProgramCardProps) {
    // Prefer backend-provided aggregates when available (numbers). Otherwise compute from semesters.
    const totalSubjects: number = typeof (program as any).total_subjects === 'number'
        ? (program as any).total_subjects
        : Object.values(program.semesters || {}).flatMap(s => s.subjects || []).length;

    const totalUnits: number = typeof (program as any).total_units === 'number'
        ? (program as any).total_units
        : Object.values(program.semesters || {}).flatMap(s => s.subjects || []).reduce((total, subject) => total + (subject?.unitsTotal || 0), 0);

    return (
        // FIX 1: Gitangtang na ang `onClick` ug `cursor-pointer` sa main div
        <motion.div variants={cardVariants} custom={index} initial="hidden" animate="visible" exit="hidden"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden group flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className={`p-5 bg-gradient-to-br text-white relative ${programColorClasses[index % programColorClasses.length]}`}>
                <h2 className="text-xl font-bold pr-16">{program.abbreviation}</h2>
                <p className="opacity-80 truncate text-sm pr-16">{program.name}</p>
                
                {/* Actions para sa Desktop (Hover Effect) */}
                <div className="absolute top-2 right-2 hidden md:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" title="Edit Program" onClick={(e) => { e.stopPropagation(); onEdit(program) }} className="h-8 w-8 bg-black/20 hover:bg-black/40"><Edit size={16} /></Button>
                    <Button size="icon" variant="ghost" title="Archive Program" onClick={(e) => { e.stopPropagation(); onDelete(program.id) }} className="h-8 w-8 bg-black/20 hover:bg-destructive/80"><Trash2 size={16} /></Button>
                </div>

                {/* Actions para sa Mobile (Permanenteng Makita) */}
                <div className="absolute top-2 right-2 flex md:hidden gap-1">
                    <Button size="icon" variant="ghost" title="Edit Program" onClick={(e) => { e.stopPropagation(); onEdit(program) }} className="h-8 w-8 bg-black/20 hover:bg-black/40"><Edit size={16} /></Button>
                    <Button size="icon" variant="ghost" title="Archive Program" onClick={(e) => { e.stopPropagation(); onDelete(program.id) }} className="h-8 w-8 bg-black/20 hover:bg-destructive/80"><Trash2 size={16} /></Button>
                </div>
            </div>
            <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4"><Calendar size={15} /><span>A.Y. {program.effectiveYear}</span></div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center text-foreground">
                            <div className="flex items-center gap-2 font-medium"><BookCopy size={15} className="text-muted-foreground" /><span>Total Subjects</span></div>
                            <span className="px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full font-semibold">{totalSubjects}</span>
                        </div>
                        <div className="flex justify-between items-center text-foreground">
                            <div className="flex items-center gap-2 font-medium"><BarChart3 size={15} className="text-muted-foreground"/><span>Total Units</span></div>
                            <span className="px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full font-semibold">{totalUnits}</span>
                        </div>
                    </div>
                </div>
                {/* FIX 2: Gibalik ang "Manage Curriculum" button */}
                <Button onClick={onManage} className="w-full mt-5" variant="secondary">Manage Curriculum</Button>
            </div>
        </motion.div>
    );
}