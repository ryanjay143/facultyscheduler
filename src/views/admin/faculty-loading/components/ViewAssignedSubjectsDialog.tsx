import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ListX } from "lucide-react"
import type { Faculty } from "../type";


interface ViewAssignedSubjectsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: Faculty | null;
}

export function ViewAssignedSubjectsDialog({ isOpen, onClose, faculty }: ViewAssignedSubjectsDialogProps) {
  if (!faculty) return null;

  const hasSubjects = faculty.assignedSubjects && faculty.assignedSubjects.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Assigned Subjects</DialogTitle>
          <DialogDescription>
            Viewing schedule for <span className="font-semibold text-primary">{faculty.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {hasSubjects ? (
            <ul className="space-y-4">
              {faculty.assignedSubjects.map((subject, index) => (
                <li key={subject.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-foreground">{subject.des_title}</p>
                      <p className="text-sm text-muted-foreground">{subject.subject_code}</p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {subject.schedule.time}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Schedule: <span className="font-medium text-foreground">{subject.schedule.day}</span>
                  </p>
                  {index < faculty.assignedSubjects.length - 1 && <Separator className="mt-4" />}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground bg-muted/50 rounded-lg">
              <ListX size={40} className="mb-4 text-slate-500" />
              <h3 className="text-lg font-semibold text-foreground">No Subjects Assigned</h3>
              <p className="text-sm">This faculty member does not have any subjects yet.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}