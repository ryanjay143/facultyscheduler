// src/app/admin/faculty-loading/components/card/FacultyCardSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export function FacultyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border flex">
      {/* Left Side Skeleton: Image Area */}
      <div className="relative flex-shrink-0 w-1/3 bg-slate-50 flex items-center justify-center p-6">
        <Skeleton className="w-24 h-24 rounded-full" />
      </div>

      {/* Right Side Skeleton: Details */}
      <div className="flex-grow flex flex-col p-5 w-2/3">
        {/* Name and Department */}
        <div className="space-y-2">
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
        </div>

        {/* Spacer to push content apart */}
        <div className="flex-grow"></div>

        {/* Expertise */}
        <div className="space-y-2 mt-4">
            <Skeleton className="h-3 w-1/3" />
            <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}