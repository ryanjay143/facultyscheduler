import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { User, BookOpen, Clock } from "lucide-react"; // <--- ADDED Clock icon
import type { Faculty } from "../type"; 
import { FacultyLoadedSchedule } from "./FacultyLoadedSchedule";

interface ViewAssignedSubjectsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: Faculty | null;
}

export function ViewAssignedSubjectsDialog({ isOpen, onClose, faculty }: ViewAssignedSubjectsDialogProps) {
  // Stores the total number of items (Lec + Lab)
  const [totalSubjects, setTotalSubjects] = useState<number>(0);

  if (!faculty) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getProfileSrc = (pic: string | null | undefined) => {
     if (!pic) return '';
     // Added a check for null/undefined if Faculty type allows it
     const picture = pic ?? ''; 
     if (picture.startsWith('http') || picture.startsWith('data:')) return picture;
     return `${import.meta.env.VITE_URL}/${picture}`; 
  };

  // Called when child component finishes fetching
  const handleDataLoaded = (count: number) => {
    setTotalSubjects(count);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden border-0 shadow-2xl">
        
        {/* HEADER */}
        <DialogHeader className="px-6 py-6 border-b bg-muted/20">
          <div className="flex items-center gap-5">
             <div className="relative">
                 <Avatar className="h-20 w-20 border-4 border-background shadow-lg ring-1 ring-muted">
                    <AvatarImage 
                        src={getProfileSrc(faculty.profile_picture)} 
                        alt={faculty.name} 
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-bold">
                        {getInitials(faculty.name)}
                    </AvatarFallback>
                 </Avatar>
                 <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
             </div>
             
             <div className="space-y-1.5">
                <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                    {faculty.name}
                </DialogTitle>
                
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md border shadow-sm">
                        <User className="h-3.5 w-3.5 text-blue-500" />
                        Faculty Member
                    </span>
                    
                    {/* REDESIGNED LABEL: Pinalitan ang BookOpen at inilagay ang "Faculty Load" */}
                    <span className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 shadow-sm text-primary">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-semibold text-foreground">View Faculty Load</span> 
                        {/* Optional: Pwede ring ilagay ang count dito (e.g., Load: {totalSubjects}) */}
                    </span>
                    
                    <span className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md border shadow-sm">
                        <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                        {/* Ipinapakita pa rin ang Total Subject Count */}
                        <span className="font-semibold text-foreground">{totalSubjects}</span> Total Subject Sections
                    </span>
                </div>
             </div>
          </div>
        </DialogHeader>

        {/* CONTENT */}
        <div className="flex-1 overflow-hidden bg-background">
           <FacultyLoadedSchedule 
                facultyId={faculty.id} 
                onDataLoaded={handleDataLoaded} 
           />
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/10 flex items-center justify-between sm:justify-between">
            <span className="text-xs text-muted-foreground italic">
                * Schedule is subject to changes by the department head.
            </span>
            <DialogClose asChild>
                <Button variant="outline" className="px-6">Close</Button>
            </DialogClose>
        </DialogFooter>
        
      </DialogContent>
    </Dialog>
  );
}