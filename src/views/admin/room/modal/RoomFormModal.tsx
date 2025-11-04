import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Room } from "../table/RoomTable"; // I-import ang type

// Props na tatanggapin ng modal
type RoomFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Room, "id">) => void;
  initialData: Room | null;
};

export function RoomFormModal({ isOpen, onClose, onSave, initialData }: RoomFormModalProps) {
  const [formData, setFormData] = useState<Omit<Room, "id">>({
    roomNumber: "",
    building: "",
    type: "Lecture",
    capacity: 40,
    status: "Available",
  });

  useEffect(() => {
    // I-reset ang form kapag nagbago ang initialData (add/edit) o kapag nag-open ang modal
    setFormData(
      initialData || {
        roomNumber: "",
        building: "",
        type: "Lecture",
        capacity: 40,
        status: "Available",
      }
    );
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Siguraduhing ang capacity ay laging number
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: "type" | "status", value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value as any }));
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Input
                id="building"
                name="building"
                value={formData.building}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => handleSelectChange("type", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lecture">Lecture</SelectItem>
                <SelectItem value="Laboratory">Laboratory</SelectItem>
                <SelectItem value="Auditorium">Auditorium</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => handleSelectChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Occupied">Occupied</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}