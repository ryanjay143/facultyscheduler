import { CheckCircle, XCircle } from 'lucide-react';
import type { Room, ClassSchedule } from '../../department/classrommSchedule/classroom-data';

const RoomManagementView = ({ rooms, schedules }: { rooms: Room[], schedules: ClassSchedule[] }) => {
  const roomsInUse = new Set(schedules.map(s => s.roomId));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map(room => {
        const isInUse = roomsInUse.has(room.id);
        return (
          <div key={room.id} className={`p-4 border rounded-lg ${isInUse ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{room.id}</span>
              <span className={`flex items-center gap-2 text-sm font-semibold ${isInUse ? 'text-red-600' : 'text-green-600'}`}>
                {isInUse ? <XCircle size={16}/> : <CheckCircle size={16}/>}
                {isInUse ? 'In Use' : 'Available'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{room.type} - Capacity: {room.capacity}</p>
          </div>
        );
      })}
    </div>
  );
};

export default RoomManagementView;