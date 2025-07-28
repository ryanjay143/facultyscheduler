import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

interface DialogScheduleFacultyProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  selectedCell: { day: string; time: string } | null;
}

// --- Sample Data for Selections ---
// In a real application, you would likely fetch this data from an API
const subjects = [
  { id: "cs101", name: "Introduction to Computer Science" },
  { id: "ma202", name: "Advanced Mathematics" },
  { id: "ph301", name: "Physics for Engineers" },
];

const sections = [
  { id: "a", name: "Section A" },
  { id: "b", name: "Section B" },
  { id: "c", name: "Section C" },
];

const faculties = [
  { id: "f001", name: "Dr. Alice Johnson" },
  { id: "f002", name: "Prof. Bob Williams" },
  { id: "f003", name: "Dr. Charlie Brown" },
];

const rooms = [
  { id: "r101", name: "Room 101" },
  { id: "r205", name: "Room 205 (Lab)" },
  { id: "r303", name: "Room 303" },
];
// ------------------------------------


function DialogScheduleFaculty({ dialogOpen, setDialogOpen, selectedCell }: DialogScheduleFacultyProps) {
  const [form, setForm] = useState({
    subject: "",
    section: "",
    faculty: "",
    room: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Reset the form whenever the dialog becomes visible
  useEffect(() => {
    if (dialogOpen) {
      setForm({
        subject: "",
        section: "",
        faculty: "",
        room: "",
        status: "Active",
      });
    }
  }, [dialogOpen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle the form submission here,
    // like sending the data to an API or updating the parent component's state.
    console.log("New Schedule Data:", { ...form, ...selectedCell });
    setDialogOpen(false); // Close the dialog after submission
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[480px] p-0 bg-white rounded-xl shadow-2xl">
        <DialogHeader className="p-6 bg-gray-50 rounded-t-xl border-b">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 text-indigo-600 rounded-lg p-3">
              <CalendarPlus className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">Add New Schedule</DialogTitle>
              {selectedCell && (
                <DialogDescription className="text-sm text-gray-500 mt-1">
                  For {selectedCell.day} at {selectedCell.time}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Schedule Input Form */}
        <form onSubmit={handleFormSubmit} className="px-6 py-6 space-y-5">
          {/* Input Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
              <Select onValueChange={(value) => setForm({ ...form, subject: value })} value={form.subject}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section</label>
              <Select onValueChange={(value) => setForm({ ...form, section: value })} value={form.section}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Faculty</label>
            <Select onValueChange={(value) => setForm({ ...form, faculty: value })} value={form.faculty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a faculty member" />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Input Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Room</label>
              <Select onValueChange={(value) => setForm({ ...form, room: value })} value={form.room}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
              <Select
                onValueChange={(value: "Active" | "Inactive") => setForm({ ...form, status: value })}
                value={form.status}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-6 flex flex-row sm:justify-end gap-3">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md">
              Save Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogScheduleFaculty;