import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogScheduleProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  selectedCell: { day: string; time: string } | null;
}

function DialogSchedule({ dialogOpen, setDialogOpen, selectedCell }: DialogScheduleProps) {
  const [form, setForm] = useState({
    subject: "",
    section: "",
    faculty: "",
    room: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Reset form when dialog opens
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

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-md p-0 rounded-md shadow-lg overflow-hidden">
        {/* Custom Header with Icon */}
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-fuchsia-500">
          <div className="bg-white/20 rounded-full p-2">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <DialogTitle className="text-white text-lg font-bold">Generate Schedule</DialogTitle>
            <DialogDescription className="text-indigo-100">
              {selectedCell && (
                <div className="flex gap-6 mt-1">
                  <span>
                    <span className="font-semibold">Day:</span> {selectedCell.day}
                  </span>
                  <span>
                    <span className="font-semibold">Time:</span> {selectedCell.time}
                  </span>
                </div>
              )}
            </DialogDescription>
          </div>
        </div>
        {/* Schedule Input Form */}
        <form
          className="space-y-4 px-6 py-6 bg-white"
          onSubmit={e => {
            e.preventDefault();
            // Handle form submission here (e.g., call API or update state)
            setDialogOpen(false);
          }}
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              required
              className="w-full border border-indigo-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Enter subject"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Section</label>
            <input
              type="text"
              required
              className="w-full border border-indigo-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Enter section"
              value={form.section}
              onChange={e => setForm({ ...form, section: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Faculty</label>
            <input
              type="text"
              required
              className="w-full border border-indigo-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Enter faculty"
              value={form.faculty}
              onChange={e => setForm({ ...form, faculty: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Room</label>
            <input
              type="text"
              required
              className="w-full border border-indigo-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Enter room"
              value={form.room}
              onChange={e => setForm({ ...form, room: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <select
              required
              className="w-full border border-indigo-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as "Active" | "Inactive" })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <DialogFooter className="pt-4 flex flex-row gap-2">
            
            <Button type="button" variant="outline" className="w-full" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="w-full text-white font-semibold shadow">
              Save Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogSchedule;