// src/components/classroom/modal/RoomFormModal.tsx

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Room } from "../RoomContainer";

type RoomFormData = Omit<Room, "id" | "status" | "created_at" | "updated_at">;

type RoomFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RoomFormData) => void;
  initialData: Room | null;
};

export function RoomFormModal({ isOpen, onClose, onSave, initialData }: RoomFormModalProps) {
  const defaultFormData: RoomFormData = {
    roomNumber: "",
    type: "Lecture",
    capacity: 40,
  };

  const [formData, setFormData] = useState<RoomFormData>(defaultFormData);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData({
                roomNumber: initialData.roomNumber,
                type: initialData.type,
                capacity: initialData.capacity,
            });
        } else {
            setFormData(defaultFormData);
        }
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
        await onSave(formData);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const handleSelectChange = (value: "Lecture" | "Laboratory") => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {initialData ? "Edit Room" : "Add New Room"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomNumber" className="text-right">Room Number / Name</Label>
            <Input id="roomNumber" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={handleSelectChange}>
                <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lecture">Lecture</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity <span className="text-muted-foreground text-xs">(Optional)</span></Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Saving...' : 'Save Room'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}