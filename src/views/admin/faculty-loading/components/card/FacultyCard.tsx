import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { User, Star, PlusCircle, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Faculty } from '../../type';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 400, damping: 30 } 
  },
};

const badgeColors = [
  "bg-sky-100 text-sky-800",
  "bg-teal-100 text-teal-800",
  "bg-violet-100 text-violet-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
];

interface FacultyCardProps {
  faculty: Faculty;
  onAssignClick: (faculty: Faculty) => void;
  onViewSubjectsClick: (faculty: Faculty) => void;
}

export function FacultyCard({ faculty, onAssignClick, onViewSubjectsClick }: FacultyCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = `${import.meta.env.VITE_URL}/${faculty.profile_picture}`;

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 border border-transparent hover:border-primary/30 group flex"
    >
      {/* Left Side: Image with a decorative background */}
      <div className="relative flex-shrink-0 w-1/3 bg-slate-50 flex items-center justify-center p-6">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent transform -skew-x-12 -ml-8"></div>
        
        <div className="relative z-10">
          {imageError ? (
            <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center border-4 border-white shadow-md">
              <User className="w-12 h-12 text-slate-400" />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={`Profile of ${faculty.name}`}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>

      {/* Right Side: Details */}
      <div className="flex-grow flex flex-col p-5">
        <div>
            <h3 className="font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors">
              {faculty.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Computer Science Department
            </p>
        </div>

        {/* --- MODIFIED EXPERTISE SECTION --- */}
        <div className="flex-grow">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0"/>
            <h4 className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider">
              AREAS OF EXPERTISE
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[44px]">
            {faculty.expertise.length > 0 ? (
              faculty.expertise.slice(0).map((exp, index) => (
                <Badge 
                  key={exp}
                  // Smaller padding (px-2 py-0.5) and text (text-[11px])
                  className={`border-transparent font-medium text-[11px] px-2 py-0.5 rounded-full hover:${badgeColors[index % badgeColors.length]} ${badgeColors[index % badgeColors.length]}`}
                >
                  {exp}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic px-1">No expertise listed.</p>
            )}
          </div>
        </div>
        {/* --- END OF MODIFICATIONS --- */}
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <Button 
            className="w-full font-semibold transition-transform hover:scale-105"
            size="sm"
            onClick={() => onAssignClick(faculty)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Assign subjects
          </Button>
          <Button
            className="w-full font-semibold transition-transform hover:scale-105"
            size="sm"
            variant="ghost"
            onClick={() => onViewSubjectsClick(faculty)}
          >
            <List className="mr-2 h-4 w-4" />
            View subjects
          </Button>
        </div>
      </div>
    </motion.div>
  );
}