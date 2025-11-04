// src/components/FacultyLoading/card/SubjectCard.tsx

import { motion } from 'framer-motion';
import { BarChartHorizontalBig, BrainCircuit, Clock, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SubjectCard({ subject, onAssignClick }: { subject: any; onAssignClick: () => void; }) {
  return (
    <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
        className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-violet-300 transition-all flex flex-col justify-between gap-4"
    >
        <div className="w-full">
            <p className="font-bold text-gray-800 text-base">{subject.code} - {subject.title}</p>
            <div className="flex items-center flex-wrap gap-2 mt-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                    <Clock size={14} />
                    <span>{subject.schedule}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-100 rounded-full">
                    <BarChartHorizontalBig size={14} />
                    <span>{subject.units} units</span>
                </div>
            </div>
            <div className="mt-3">
                <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-violet-800 bg-violet-100 rounded-full w-fit">
                    <BrainCircuit size={12}/> {subject.expertise}
                </div>
            </div>
        </div>
        <Button
            onClick={onAssignClick}
            className="w-full flex items-center justify-center gap-2"
        >
            <PlusCircle size={16} />
            <span>Assign to Faculty</span>
        </Button>
    </motion.div>
  );
}