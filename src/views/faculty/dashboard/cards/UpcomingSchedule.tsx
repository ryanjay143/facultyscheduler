import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Clock, XCircle, RotateCcw, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// --- TYPE & MOCK DATA ---
interface ScheduleItem {
    id: number;
    time: string;
    subject: string;
    room: string;
    program: string;
    cancelled: boolean;
    reason: string | null;
    notificationSent: boolean;
}

const initialSchedule: ScheduleItem[] = [
  { id: 1, time: "08:30 AM - 10:00 AM", subject: "IT-321: Advanced Web Dev", room: "Room 404", program: "BSIT", cancelled: false, reason: null, notificationSent: false },
  { id: 2, time: "10:00 AM - 11:30 AM", subject: "CS-101: Intro to Programming", room: "Room 301", program: "BSCS", cancelled: false, reason: null, notificationSent: false },
  { id: 3, time: "01:00 PM - 02:30 PM", subject: "IT-412: Project Management", room: "Lab 2", program: "BSIT", cancelled: false, reason: null, notificationSent: false },
  { id: 4, time: "03:00 PM - 04:30 PM", subject: "DS-202: Data Structures", room: "Room 505", program: "BSCS", cancelled: true, reason: "Faculty is on official business leave.", notificationSent: true },
];

function UpcomingSchedule() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [classToCancel, setClassToCancel] = useState<ScheduleItem | null>(null);

  // --- HANDLER FUNCTIONS ---
  const handleOpenCancelModal = (item: ScheduleItem) => {
    setClassToCancel(item);
    setIsCancelModalOpen(true);
  };
  
  const handleRestoreClass = (id: number) => {
    setSchedule(prevSchedule =>
      prevSchedule.map(item =>
        item.id === id ? { ...item, cancelled: false, reason: null, notificationSent: false } : item
      )
    );
    toast.success(`Class Restored: ${schedule.find(item => item.id === id)?.subject}`);
  };

  const handleConfirmCancellation = (id: number, reason: string, sendEmail: boolean) => {
    setSchedule(prev => prev.map(item => 
        item.id === id ? {...item, cancelled: true, reason, notificationSent: sendEmail} : item
    ));
    toast.error(`Class Cancelled: ${classToCancel?.subject}`);
    if (sendEmail) {
        toast.info(`Email notification sent regarding ${classToCancel?.subject}.`);
    }
  };

  return (
    <>
      <Card className="shadow-lg rounded-2xl h-full flex flex-col bg-white border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-3">
              <Clock size={24} className="text-indigo-500" />
              Today's Schedule
          </CardTitle>
          <CardDescription>A live overview of your class statuses for today.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <AnimatePresence>
              {schedule.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`flex items-center p-4 rounded-xl transition-all duration-300
                    ${item.cancelled 
                      ? 'bg-rose-50 border-l-4 border-rose-400' 
                      : 'bg-slate-50 border-l-4 border-indigo-500 hover:shadow-md hover:border-indigo-600'
                    }`
                  }
                >
                  <div className="flex-shrink-0 w-32">
                    <p className={`text-sm font-semibold transition-colors duration-300 ${item.cancelled ? 'text-rose-600' : 'text-indigo-700'}`}>
                      <span className={item.cancelled ? 'line-through' : ''}>{item.time}</span>
                    </p>
                  </div>
                  <div className={`ml-4 flex-grow transition-all duration-300 ${item.cancelled ? 'text-slate-400' : 'text-slate-700'}`}>
                    <p className={`font-bold ${item.cancelled ? 'text-rose-800' : 'text-slate-800'}`}>
                        <span className={item.cancelled ? 'line-through' : ''}>{item.subject}</span>
                    </p>
                    <p className="text-sm">
                        <span className={item.cancelled ? 'line-through' : ''}>{item.room} &bull; {item.program}</span>
                    </p>
                    {item.cancelled && <p className="text-xs text-rose-600 mt-1">Reason: {item.reason}</p>}
                  </div>
                  <div className="ml-4">
                    {item.cancelled ? (
                        item.notificationSent ? (
                            <div className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                                <Send size={20} />
                                <span className="text-sm font-semibold hidden sm:inline">Sent</span>
                            </div>
                        ) : (
                            <button onClick={() => handleRestoreClass(item.id)} className="group flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-colors duration-200">
                                <RotateCcw size={20} className="transition-transform duration-200 group-hover:rotate-[-45deg]" />
                                <span className="text-sm font-semibold hidden sm:inline">Restore</span>
                            </button>
                        )
                    ) : (
                      <button onClick={() => handleOpenCancelModal(item)} className="group flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors duration-200">
                        <XCircle size={20} className="transition-transform duration-200 group-hover:scale-110" />
                        <span className="text-sm font-semibold hidden md:inline opacity-0 group-hover:opacity-100 transition-opacity">Cancel</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      
      <CancelClassModal 
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        classData={classToCancel}
        onConfirm={handleConfirmCancellation}
      />
    </>
  );
}

// --- Reusable Modal Form Component for Cancelling a Class ---
type CancelClassModalProps = {
    isOpen: boolean;
    onClose: () => void;
    classData: ScheduleItem | null;
    onConfirm: (id: number, reason: string, sendEmail: boolean) => void;
}

function CancelClassModal({ isOpen, onClose, classData, onConfirm }: CancelClassModalProps) {
    const [reason, setReason] = useState('');
    const [sendEmail, setSendEmail] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setReason('');
            setSendEmail(true);
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.warning('Please provide a reason for cancellation.');
            return;
        }
        if (classData) {
            onConfirm(classData.id, reason, sendEmail);
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='md:w-[90%]'>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Cancel Class</DialogTitle>
                    <DialogDescription>
                        Provide a reason for cancelling: <span className="font-semibold text-gray-800">{classData?.subject}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <Label htmlFor="reason">Reason for Cancellation</Label>
                        <Textarea 
                            id="reason" 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Emergency faculty meeting, personal leave, etc."
                            className="min-h-[100px] mt-1"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="sendEmail" 
                            checked={sendEmail}
                            onCheckedChange={(checked) => setSendEmail(!!checked)}
                        />
                        <label
                          htmlFor="sendEmail"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Send email notification to students
                        </label>
                    </div>
                </div>
                <DialogFooter className='flex flex-col gap-2'>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Back</Button>
                    </DialogClose>
                    <Button type="button" variant="destructive" onClick={handleSubmit}>
                        Confirm Cancellation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default UpcomingSchedule;