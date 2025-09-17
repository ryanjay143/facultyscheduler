import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Users } from "lucide-react";

type Room = {
  id: string | number;
  type?: string;
  capacity?: number;
  available?: boolean;
};

export const RoomAvailabilityList = ({ rooms }: { rooms: any[] }) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-700">
          <Users size={22} />
        </div>
        <p className="font-semibold text-gray-800">No rooms to show</p>
        <p className="text-sm text-gray-500">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {rooms.map((r: Room) => {
        const isAvailable = !!r.available;
        const cardAccent = isAvailable
          ? "from-green-500/70 to-green-400/40"
          : "from-red-500/70 to-red-400/40";
        const cardBorder = isAvailable ? "border-green-200" : "border-red-200";
        const badgeColor = isAvailable
          ? "bg-green-600 text-white hover:bg-green-600"
          : "bg-red-600 text-white hover:bg-red-600";

        return (
          <div
            key={String(r.id)}
            role="region"
            aria-label={`Room ${r.id} — ${isAvailable ? "Available" : "In Use"}`}
            className={`group relative overflow-hidden rounded-xl border bg-white ${cardBorder} shadow-sm transition-all hover:shadow-md`}
          >
            {/* Left status accent */}
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${cardAccent}`}
              aria-hidden="true"
            />
            {/* Hover ring */}
            <div
              className={`absolute inset-0 rounded-xl ring-0 ring-offset-0 transition group-hover:ring-2 ${
                isAvailable ? "ring-green-200" : "ring-red-200"
              }`}
              aria-hidden="true"
            />

            <div className="relative p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-lg font-bold text-gray-900" title={`Room ${r.id}`}>
                  {r.id}
                </p>
                <Badge
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium ${badgeColor}`}
                  variant="secondary"
                >
                  {isAvailable ? (
                    <>
                      <CheckCircle size={14} className="opacity-90" />
                      Available
                    </>
                  ) : (
                    <>
                      <XCircle size={14} className="opacity-90" />
                      In Use
                    </>
                  )}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-700">
                <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 font-medium">
                  {r.type ?? "General"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 font-medium">
                  <Users size={14} className="text-gray-500" aria-hidden="true" />
                  Capacity: {typeof r.capacity === "number" ? r.capacity : "N/A"}
                </span>

                {/* Status hint on the far right for quick scanning */}
                <span
                  className={`ml-auto inline-flex items-center gap-1 font-medium ${
                    isAvailable ? "text-green-700" : "text-red-700"
                  }`}
                  aria-hidden="true"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isAvailable ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {isAvailable ? "Open" : "Busy"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomAvailabilityList;