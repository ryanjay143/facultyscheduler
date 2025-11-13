// src/components/classroom/modal/ViewScheduleModal.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// Import the centralized types from RoomContainer
import type { Room, ScheduleEntry, Subject } from "../RoomContainer";

// --- PROPS ---
// This is the part that needs to be fixed.
// We are adding 'subjectsData' to the type definition.
type ViewScheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  scheduleData: ScheduleEntry[];
  subjectsData: Subject[]; // <--- ADD THIS LINE
};

export function ViewScheduleModal({ isOpen, onClose, room, scheduleData, subjectsData }: ViewScheduleModalProps) { // <-- And add it here
  if (!room) return null;

  const roomSchedule = scheduleData.filter(s => s.roomId === room.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Schedule for Room: {room.roomNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomSchedule.length > 0 ? (
                  roomSchedule.map(entry => {
                    // Use the 'subjectsData' prop to find the subject name
                    const subject = subjectsData.find(s => s.id === entry.subjectId);
                    return (
                        <TableRow key={entry.scheduleId}>
                            <TableCell>{subject ? `${subject.code} - ${subject.name}` : 'Unknown Subject'}</TableCell>
                            <TableCell>{entry.day}</TableCell>
                            <TableCell>{entry.startTime} - {entry.endTime}</TableCell>
                        </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      No classes scheduled for this room.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}