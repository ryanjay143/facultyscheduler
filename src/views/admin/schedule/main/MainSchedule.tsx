import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ScheduleTableClass from "../table/ScheduleTableClass";
import ScheduleTableFaculty from "../table/ScheduleTableFaculty";
import { useRef, useState } from "react";
import * as htmlToImage from 'html-to-image';


function MainSchedule() {
    const [scheduleView, setScheduleView] = useState('faculty');
    const handleDownload = () => {
    if (tableRef.current === null) {
      return;
    }

    htmlToImage.toPng(tableRef.current, { cacheBust: true, backgroundColor: '#ffffff' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${scheduleView}-schedule.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
      });
  };
   const tableRef = useRef<HTMLDivElement>(null);
  return (
  <>
    <div className="flex flex-row gap-4 justify-between items-center mb-5 md:mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Manage Schedule
          </h1>
          <Button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow"
          >
            <Download className="w-5 h-5" />
            Download
          </Button>
        </div>
        <div>
          <p className="text-gray-600 mb-4">
            View and manage your schedule. You can download the schedule for offline access.
          </p>

          {/* Radio buttons to switch between views */}
          <div className="flex gap-6 mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="scheduleType"
                value="faculty"
                checked={scheduleView === 'faculty'}
                onChange={(e) => setScheduleView(e.target.value)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-gray-700 font-medium">Faculty Schedule</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="scheduleType"
                value="class"
                checked={scheduleView === 'class'}
                onChange={(e) => setScheduleView(e.target.value)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-gray-700 font-medium">Class Schedule</span>
            </label>
          </div>

          {/* Conditionally render the selected table */}
          <div>
            {scheduleView === 'class' 
              ? <ScheduleTableClass ref={tableRef} /> 
              : <ScheduleTableFaculty ref={tableRef} />}
          </div>
        </div>
  </>
     
      
   
  
  )
}

export default MainSchedule
