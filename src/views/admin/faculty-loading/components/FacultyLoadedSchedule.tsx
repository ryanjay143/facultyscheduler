import { useEffect, useState, useMemo } from 'react';
import axios from '../../../../plugin/axios';
import { 
    Loader2, 
    CalendarCheck, 
    AlertCircle, 
    Clock, 
    MapPin, 
    Presentation, 
    FlaskConical
    // Users icon removed
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// --- TYPES ---
interface ClassSchedule {
    id: number;
    type: 'LEC' | 'LAB';
    day: string;
    start_time: string;
    end_time: string;
    // section: string; // Removed Section
    subject: {
        subject_code: string;
        des_title: string;
    };
    room: {
        roomNumber: string;
    };
}

interface FacultyLoadedScheduleProps {
    facultyId: number;
    onDataLoaded?: (totalCount: number) => void;
}

// --- HELPER FUNCTIONS ---
const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return '';
    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    if (hours > 0 && minutes > 0) return `${hours} hr ${minutes} mins`;
    if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
    return `${minutes} mins`;
};

const dayOrder: Record<string, number> = {
    'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7
};

export function FacultyLoadedSchedule({ facultyId, onDataLoaded }: FacultyLoadedScheduleProps) {
    const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    useEffect(() => {
        const fetchSchedules = async () => {
            if (!facultyId) return;
            setIsLoading(true);
            setError(false);
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`faculty-loading/${facultyId}/schedules`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data.success) {
                    const data = response.data.data;
                    setSchedules(data);

                    if (onDataLoaded) {
                        onDataLoaded(data.length);
                    }
                }
            } catch (err) {
                console.error("Error fetching schedules", err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedules();
    }, [facultyId]); 

    const weeklySchedule = useMemo(() => {
        const map = new Map<string, ClassSchedule[]>();
        Object.keys(dayOrder).forEach(day => map.set(day, []));

        schedules.forEach(sched => {
            const day = sched.day;
            if (map.has(day)) {
                map.get(day)!.push(sched);
            }
        });

        map.forEach((scheds) => {
            scheds.sort((a, b) => a.start_time.localeCompare(b.start_time));
        });

        return map;
    }, [schedules]);

    const daysList = Object.keys(dayOrder).filter(d => d !== 'Sunday');
    const defaultTab = daysList.includes(currentDayName) ? currentDayName : 'Monday';

    if (isLoading) {
        return <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p>Loading schedule...</p></div>;
    }

    if (error) {
        return <div className="flex flex-col items-center justify-center h-64 text-destructive p-6 text-center"><AlertCircle className="h-10 w-10 mb-2" /><p className="font-medium">Failed to load schedule.</p></div>;
    }

    return (
        <div className="h-full flex flex-col bg-muted/10 rounded-lg overflow-hidden border">
            <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col h-full w-full">
                
                {/* --- DAYS NAVIGATION --- */}
                <div className="bg-background border-b px-2 pt-2">
                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-2 overflow-x-auto no-scrollbar pb-2">
                        {daysList.map((day) => {
                            const count = weeklySchedule.get(day)?.length || 0;
                            const isActiveDay = count > 0;
                            
                            return (
                                <TabsTrigger 
                                    key={day} 
                                    value={day}
                                    className={`
                                        flex flex-col gap-1 rounded-md border px-4 py-2 min-w-[90px] transition-all
                                        data-[state=active]:border-primary data-[state=active]:bg-primary/5
                                        ${!isActiveDay ? 'opacity-60' : ''}
                                    `}
                                >
                                    <span className="text-xs font-semibold uppercase text-muted-foreground">{day.substring(0, 3)}</span>
                                    <span className={`text-lg font-bold ${isActiveDay ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {count}
                                    </span>
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>
                </div>

                {/* --- SCHEDULE CONTENT --- */}
                <div className="flex-1 bg-muted/5 relative">
                    {daysList.map((day) => {
                        const dailySchedules = weeklySchedule.get(day) || [];

                        return (
                            <TabsContent key={day} value={day} className="h-full m-0 absolute inset-0">
                                <ScrollArea className="h-full px-4 py-4">
                                    <div className="max-w-4xl mx-auto space-y-4 pb-10">
                                        
                                        <div className="mb-4 pl-1 flex justify-between items-center">
                                            <h2 className="text-lg font-semibold text-foreground">{day} Schedule</h2>
                                            <Badge variant="outline" className="text-muted-foreground">
                                                {dailySchedules.length} {dailySchedules.length === 1 ? 'Subject' : 'Subjects'}
                                            </Badge>
                                        </div>

                                        {dailySchedules.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
                                                <CalendarCheck className="h-14 w-14 mb-4 text-muted-foreground/30" />
                                                <p className="font-medium">No classes scheduled.</p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                {dailySchedules.map((sched) => (
                                                    <ScheduleCard key={sched.id} sched={sched} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        );
                    })}
                </div>
            </Tabs>
        </div>
    );
}

// --- CARD COMPONENT ---
function ScheduleCard({ sched }: { sched: ClassSchedule }) {
    const isLec = sched.type === 'LEC';
    const theme = isLec 
        ? { border: "border-l-blue-500", bg: "bg-blue-50/40", text: "text-blue-700", badge: "bg-blue-100 hover:bg-blue-200 text-blue-800" } 
        : { border: "border-l-amber-500", bg: "bg-amber-50/40", text: "text-amber-700", badge: "bg-amber-100 hover:bg-amber-200 text-amber-800" };
    
    const Icon = isLec ? Presentation : FlaskConical;
    const duration = calculateDuration(sched.start_time, sched.end_time);

    return (
        <Card className={`overflow-hidden shadow-sm hover:shadow-md transition-shadow border-l-[6px] ${theme.border}`}>
            <CardContent className="p-0 flex flex-col sm:flex-row">
                {/* Time Column */}
                <div className={`p-4 flex flex-col justify-center items-center sm:w-36 border-b sm:border-b-0 sm:border-r ${theme.bg}`}>
                    <div className="text-center">
                        <span className="block text-lg font-bold text-foreground leading-none">{formatTime(sched.start_time)}</span>
                        <span className="text-[10px] text-muted-foreground font-medium my-1 block">to</span>
                        <span className="block text-sm font-medium text-muted-foreground leading-none">{formatTime(sched.end_time)}</span>
                    </div>
                    <Separator className="my-3 w-12 bg-black/10" />
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{duration}</span>
                    </div>
                </div>

                {/* Info Column */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-foreground tracking-tight uppercase">{sched.subject.subject_code}</h3>
                                <Badge variant="secondary" className={`${theme.badge} border-none`}>
                                    <Icon className="h-3 w-3 mr-1" />
                                    {sched.type === 'LEC' ? 'Lecture' : 'Laboratory'}
                                </Badge>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{sched.subject.des_title}</p>
                    </div>

                    {/* Footer Row: Room (Section Removed) */}
                    <div className="mt-4 pt-3 border-t flex flex-wrap items-center gap-x-6 gap-y-2">
                        
                        {/* Room Info */}
                        <div className="flex items-center gap-2">
                            <div className="bg-muted p-1.5 rounded-md">
                                <MapPin className="h-4 w-4 text-foreground/70" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground leading-tight">Room</span>
                                <span className="text-sm font-bold text-foreground">{sched.room.roomNumber}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </CardContent>
        </Card>
    );
}