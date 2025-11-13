// src/components/modal/ScheduleModal.tsx

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import type { Faculty } from '../table/FacultyTable';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react'; // Import Loader2 for loading spinner
import axios from "../../../../plugin/axios"; // Your configured axios instance

// Interface for a single time slot
interface TimeSlot {
  id: number; // Can be a database ID or a temporary client-side ID (like Date.now())
  start: string;
  end: string;
}

// Props for the modal component
interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: Faculty | null;
}

// The days of the week to display
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * A modal to view, set, and update the weekly availability for a faculty member.
 */
export function ScheduleModal({ isOpen, onClose, faculty }: ScheduleModalProps) {
  // State to hold the schedule data, e.g., { Monday: [{...}], Tuesday: [] }
  const [availability, setAvailability] = useState<Record<string, TimeSlot[]>>({});
  
  // State to manage the loading spinner when fetching existing data
  const [isLoading, setIsLoading] = useState(true);
  
  // State to manage the "Saving..." state of the save button
  const [isSaving, setIsSaving] = useState(false);

  // This effect runs when the modal is opened (`isOpen` becomes true)
  useEffect(() => {
    // Only fetch data if the modal is open and a faculty has been selected
    if (isOpen && faculty) {
      const fetchAvailability = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error("Authentication required.");
            setIsLoading(false);
            return;
        }
        try {
          // Make a GET request to the Laravel endpoint to get the schedule
          const response = await axios.get(
            `/faculties/${faculty.id}/availability`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          // Update the state with the data fetched from the database
          setAvailability(response.data);
        } catch (error) {
          toast.error("Could not fetch the existing schedule for this faculty.");
          // If fetching fails, initialize with a blank schedule
          setAvailability({});
        } finally {
          setIsLoading(false); // Stop the loading spinner
        }
      };

      fetchAvailability();
    }
  }, [isOpen, faculty]); // This effect depends on `isOpen` and `faculty`

  // Don't render anything if there's no faculty selected
  if (!faculty) return null;

  // Function to add a new, blank time slot for a specific day
  const addTimeSlot = (day: string) => {
    const newSlot: TimeSlot = {
      id: Date.now(), // Use a temporary, unique ID for the key
      start: '',
      end: '',
    };
    setAvailability(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), newSlot],
    }));
  };

  // Function to update the start or end time of a specific slot
  const updateTimeSlot = (day: string, slotId: number, field: 'start' | 'end', value: string) => {
    setAvailability(prev => {
      const updatedSlots = (prev[day] || []).map(slot =>
        slot.id === slotId ? { ...slot, [field]: value } : slot
      );
      return { ...prev, [day]: updatedSlots };
    });
  };

  // Function to remove a time slot from a day
  const removeTimeSlot = (day: string, slotId: number) => {
    setAvailability(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(slot => slot.id !== slotId),
    }));
  };

  // Function to save the entire schedule to the database
  const handleSaveSchedule = async () => {
    // 1. Perform client-side validation first
    for (const day in availability) {
      for (const slot of availability[day]) {
        if (!slot.start || !slot.end) {
          toast.error(`Please complete all time fields for ${day}.`);
          return;
        }
        if (slot.start >= slot.end) {
          toast.error(`On ${day}, the end time must be after the start time.`);
          return;
        }
      }
    }

    setIsSaving(true); // Show "Saving..." on the button

    const token = localStorage.getItem('accessToken');
    if (!token) {
        toast.error("Authentication required. Please log in again.");
        setIsSaving(false);
        return;
    }

    try {
        // 2. Make the POST request to the Laravel endpoint
        const response = await axios.post(
            `/faculties/${faculty.id}/availability`,
            availability, // The entire `availability` object is sent as the body
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        // 3. Handle the successful response
        toast.success(response.data.message || `Schedule updated successfully.`);
        onClose(); // Close the modal

    } catch (error: any) {
        // 4. Handle any errors from the backend
        const errorMessage = error.response?.data?.message || "An unknown error occurred while saving.";
        toast.error(errorMessage);
    } finally {
        setIsSaving(false); // Re-enable the button
    }
  };
  
  // Function to handle closing the dialog
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Set Availability for {faculty.name}</DialogTitle>
          <DialogDescription>
            Add or update time slots for each day the faculty is available to teach.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6 py-4">
          {/* Show a loading spinner while fetching data */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4">Loading existing schedule...</p>
            </div>
          ) : (
            // Once loaded, map over the days and display the form
            daysOfWeek.map((day) => (
              <div key={day} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{day}</h4>
                  <Button variant="outline" size="sm" onClick={() => addTimeSlot(day)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add time slot
                  </Button>
                </div>

                {/* Check if there are any time slots for the current day */}
                {availability[day] && availability[day].length > 0 ? (
                  <div className="space-y-2 pl-4 border-l-2">
                    {availability[day].map((slot) => (
                      <div key={slot.id} className="flex items-center gap-2">
                        <Input type="time" value={slot.start} onChange={(e) => updateTimeSlot(day, slot.id, 'start', e.target.value)} />
                        <span className="text-muted-foreground">-</span>
                        <Input type="time" value={slot.end} onChange={(e) => updateTimeSlot(day, slot.id, 'end', e.target.value)} />
                        <Button variant="ghost" size="icon" onClick={() => removeTimeSlot(day, slot.id)} title="Remove slot">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground pl-4">Not available on this day.</p>
                )}
              </div>
            ))
          )}
        </div>

        <DialogFooter className="mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSaveSchedule} disabled={isSaving || isLoading}>
            {isSaving ? "Saving..." : "Save Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}