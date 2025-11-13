// src/components/classroom/modal/RoomFormModal.tsx

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Room } from "../RoomContainer";


// Props that the modal will accept
type RoomFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Room, "id">) => void;
  initialData: Room | null;
};

// The data structure for the form state, excluding the 'id'
type RoomFormData = Omit<Room, "id">;

export function RoomFormModal({ isOpen, onClose, onSave, initialData }: RoomFormModalProps) {
  const defaultFormData: RoomFormData = {
    roomNumber: "",
    type: "Lecture",
    capacity: 40,
  };

  const [formData, setFormData] = useState<RoomFormData>(defaultFormData);

  useEffect(() => {
    // Reset the form when initialData changes (for add/edit)
    setFormData(initialData || defaultFormData);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Ensure capacity is always a number
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (value: "Lecture" | "Laboratory" | "Other") => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {initialData ? "Edit Room" : "Add New Room"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomNumber">Room Number</Label>
            <Input
              id="roomNumber"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lecture">Lecture</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}