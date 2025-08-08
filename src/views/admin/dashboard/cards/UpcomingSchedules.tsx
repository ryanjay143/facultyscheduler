// src/components/dashboard/UpcomingSchedules.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const allSchedules = [
  { time: '08:00 AM', subject: 'CS101 - Intro to Programming', room: '101', faculty: 'Dr. Johnson', color: 'bg-sky-500' },
  { time: '09:00 AM', subject: 'ENG102 - English Composition', room: '103', faculty: 'Ms. Lee', color: 'bg-amber-500' },
  { time: '10:00 AM', subject: 'MATH201 - Calculus II', room: '202', faculty: 'Prof. Smith', color: 'bg-emerald-500' },
  { time: '11:00 AM', subject: 'BIO110 - General Biology', room: '104', faculty: 'Dr. Kim', color: 'bg-rose-500' },
  { time: '12:00 PM', subject: 'Lunch Break', room: 'Cafeteria', faculty: 'All Staff', color: 'bg-gray-400' },
  { time: '01:00 PM', subject: 'PHYS201 - University Physics', room: '205', faculty: 'Dr. Miller', color: 'bg-indigo-500' },
  { time: '02:00 PM', subject: 'HIST101 - World History', room: '301', faculty: 'Ms. Park', color: 'bg-fuchsia-500' },
  { time: '03:00 PM', subject: 'ART210 - Art History', room: 'Art Studio', faculty: 'Mr. Adams', color: 'bg-orange-500' },
  { time: '04:00 PM', subject: 'CHEM201 - Organic Chemistry', room: 'Chem Lab', faculty: 'Prof. Green', color: 'bg-teal-500' },
  { time: '05:00 PM', subject: 'PHIL300 - Advanced Philosophy', room: '303', faculty: 'Dr. King', color: 'bg-slate-600' },
];

const INITIAL_DISPLAY_COUNT = 4; 

export const UpcomingSchedules: React.FC = () => {
  // State para i-control kung ipakita ba ang tanan
  const [showAll, setShowAll] = useState(false);

  // I-determine kung unsang schedules ang ipakita base sa state
  const schedulesToShow = showAll ? allSchedules : allSchedules.slice(0, INITIAL_DISPLAY_COUNT);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <Card className="shadow-lg rounded-xl h-full space-y-8 bg-purple-100">
      <CardHeader>
        <CardTitle>Today's Upcoming Schedules</CardTitle>
        <CardDescription>A quick look at the next classes for today.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="relative">
          {schedulesToShow.map((item, index) => (
            <div key={item.time} className="flex gap-4 group transition-all duration-300">
              
              {/* Timeline Column */}
              <div className="flex flex-col items-center">
                <div className={`relative z-10 w-4 h-4 rounded-full ${item.color}`}></div>
                {/* Ayaw ipakita ang linya sa pinaka-ubos nga item sa CURRENT view */}
                {index < schedulesToShow.length - 1 && (
                  <div className="w-px flex-grow bg-gray-200 group-hover:bg-indigo-200 transition-colors"></div>
                )}
              </div>

              {/* Schedule Details Column */}
              <div className="pb-8 flex-1">
                <div className="flex items-baseline gap-2">
                    <p className="text-sm font-bold text-indigo-600">{item.time}</p>
                    <p className="text-xs text-gray-500">Room {item.room}</p>
                </div>
                <p className="font-semibold text-gray-800 mt-1">{item.subject}</p>
                <p className="text-sm text-gray-500">
                  Assigned to: {item.faculty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      {/* --- "Show More" / "Show Less" Button --- */}
      {allSchedules.length > INITIAL_DISPLAY_COUNT && (
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            onClick={toggleShowAll}
          >
            {showAll ? 'Show Less' : `Show ${allSchedules.length - INITIAL_DISPLAY_COUNT} More`}
            {showAll 
                ? <ChevronUp size={16} className="ml-2" /> 
                : <ChevronDown size={16} className="ml-2" />
            }
          </Button>
        </div>
      )}
    </Card>
  );
};