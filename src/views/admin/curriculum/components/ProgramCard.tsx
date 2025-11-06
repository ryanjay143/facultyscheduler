// src/pages/Curriculum/components/ProgramCard.tsx

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, BookCopy, BarChart3, ArchiveRestore } from 'lucide-react';
import type { Program } from '../types';

const programColorClasses = [ 'from-purple-600 to-indigo-600', 'from-blue-500 to-teal-400', 'from-pink-500 to-rose-500', 'from-orange-500 to-amber-500', 'from-green-500 to-lime-500', 'from-cyan-500 to-sky-500' ];
const cardVariants: Variants = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }) };

interface ProgramCardProps {
    program: Program;
    index: number;
    onEdit: (program: Program) => void;
    onArchive: (programId: number) => void; 
    onRestore: (programId: number) => void;
    onManage: () => void;
}

export function ProgramCard({ program, index, onEdit, onArchive, onRestore, onManage }: ProgramCardProps) {
    const totalSubjects = program.total_subjects;
    const totalUnits = program.total_units;
    
    const ActionButtons = () => (
        <>
            <Button size="icon" variant="ghost" title="Edit Program" onClick={(e) => { e.stopPropagation(); onEdit(program); }} className="h-8 w-8 bg-black/20 hover:bg-green-500"><Edit size={16} /></Button>
            {program.isActive ? (
                <Button 
                    size="icon" 
                    variant="ghost" 
                    title="Archive Program" 
                    onClick={(e) => { e.stopPropagation(); onArchive(program.id); }} 
                    className="h-8 w-8 bg-black/20 hover:bg-destructive/80"
                >
                    <Trash2 size={16} />
                </Button>
            ) : (
                <Button 
                    size="icon" 
                    variant="ghost" 
                    title="Restore Program" 
                    onClick={(e) => { e.stopPropagation(); onRestore(program.id); }} 
                    className="h-8 w-8 bg-black/20 hover:bg-green-500"
                >
                    <ArchiveRestore size={16} />
                </Button>
            )}
        </>
    );

    return (
        <motion.div 
            variants={cardVariants} custom={index} initial="hidden" animate="visible" exit="hidden"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden group flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
        >
            <div className={`p-5 bg-gradient-to-br text-white relative ${programColorClasses[index % programColorClasses.length]} ${!program.isActive && 'opacity-60'}`}>
                <h2 className="text-xl font-bold pr-20">{program.abbreviation}</h2>
                <p className="opacity-80 truncate text-sm pr-20">{program.name}</p>
                
                {!program.isActive && (
                    <div className="absolute bottom-2 left-5 px-2.5 py-1 bg-red-600/90 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Inactive
                    </div>
                )}

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ActionButtons />
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
                <Button onClick={onManage} className="w-full mt-5" variant="secondary" disabled={!program.isActive}>
                    Manage Curriculum
                </Button>
            </div>
        </motion.div>
    );
}