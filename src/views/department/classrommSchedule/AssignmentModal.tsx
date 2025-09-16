import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, X, Building2, MapPin, Users, BookOpen, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type Room = {
  id: string | number;
  type?: string;
  capacity?: number;
  location?: string;
};

type ClassInfo = {
  id?: string | number;
  code: string;
  title: string;
  department?: string;
  days?: string[];
  time?: string;
  instructor?: string;
};

type Props = {
  onClose: () => void;
  classInfo: ClassInfo;
  availableRooms: Room[];
  onConfirm?: (room: Room) => void;
};

const AssignmentModal: React.FC<Props> = ({
  onClose,
  classInfo,
  availableRooms,
  onConfirm,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const headingId = "assign-classroom-heading";
  const descriptionId = "assign-classroom-description";
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const roomsById = useMemo(() => {
    const map = new Map<string, Room>();
    availableRooms.forEach((r) => map.set(String(r.id), r));
    return map;
  }, [availableRooms]);

  const selectedRoom = selectedRoomId ? roomsById.get(selectedRoomId) : undefined;

  useEffect(() => {
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, []);

  const onKeyDownOverlay = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!selectedRoom) return;
    try {
      setIsSubmitting(true);
      if (onConfirm) {
        await Promise.resolve(onConfirm(selectedRoom));
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={onKeyDownOverlay}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 12, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative border-b bg-gradient-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Building2 size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 id={headingId} className="truncate text-xl font-bold text-gray-900">
                Assign Classroom
              </h2>
              <p id={descriptionId} className="mt-0.5 text-sm text-gray-600">
                Assigning{" "}
                <span className="font-medium">
                  {classInfo.code} — {classInfo.title}
                </span>
              </p>
            </div>
          </div>

          {/* Close button */}
          <Button
            ref={closeBtnRef}
            onClick={onClose}
            variant="ghost"
            className="absolute right-2 top-2 h-9 w-9 p-0 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Class summary card */}
          <div className="mb-5 rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-2 font-semibold text-gray-800">
                <BookOpen size={16} className="text-gray-500" aria-hidden="true" />
                {classInfo.code}
              </span>

              {classInfo.department && (
                <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700">
                  {classInfo.department}
                </span>
              )}

              {(classInfo.days?.length || classInfo.time) && (
                <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700">
                  <Clock size={14} className="text-gray-500" aria-hidden="true" />
                  <span className="truncate">
                    {Array.isArray(classInfo.days) ? classInfo.days.join(", ") : ""}{" "}
                    {classInfo.time ? `• ${classInfo.time}` : ""}
                  </span>
                </span>
              )}

              {classInfo.instructor && (
                <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700">
                  <User size={14} className="text-gray-500" aria-hidden="true" />
                  <span className="truncate max-w-[10rem]" title={classInfo.instructor}>
                    {classInfo.instructor}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Room selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Available Rooms</label>

            {availableRooms.length === 0 ? (
              <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <span>No rooms available for this timeslot.</span>
              </div>
            ) : (
              <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue placeholder="Select a room..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {availableRooms.map((r) => (
                    <SelectItem key={String(r.id)} value={String(r.id)}>
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="shrink-0 font-medium">{r.id}</span>
                        {r.type && (
                          <span className="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-700">
                            {r.type}
                          </span>
                        )}
                        {typeof r.capacity === "number" && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-600">
                            <Users size={12} aria-hidden="true" />
                            {r.capacity}
                          </span>
                        )}
                        {r.location && (
                          <span className="ml-auto inline-flex items-center gap-1 truncate text-[11px] text-gray-500">
                            <MapPin size={12} aria-hidden="true" />
                            {r.location}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t bg-slate-50 px-6 py-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedRoom || isSubmitting}
            className="inline-flex items-center gap-2"
          >
            <CheckCircle size={16} />
            {isSubmitting ? "Assigning..." : "Confirm Assignment"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssignmentModal;