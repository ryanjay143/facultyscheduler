import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonProgramCard() {
    return (
        <div className="bg-card rounded-xl border border-border shadow-sm p-5 space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-5 w-3/4" />
            <div className="pt-4 space-y-3">
                <div className="flex justify-between items-center"><Skeleton className="h-5 w-1/2" /><Skeleton className="h-6 w-10 rounded-full" /></div>
                <div className="flex justify-between items-center"><Skeleton className="h-5 w-1/2" /><Skeleton className="h-6 w-10 rounded-full" /></div>
            </div>
            <Skeleton className="h-10 w-full mt-5" />
        </div>
    );
}
