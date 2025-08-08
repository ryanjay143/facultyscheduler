import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Download, Users, BookOpen, Calendar as CalendarIcon } from "lucide-react";
import { StatCard } from '@/components/ui/StatCard';
import { BarChart } from '@/components/dashboard/BarChart';
import { FacultyReportTable } from '../table/FacultyReportTable';
import { ClassScheduleReportTable } from '../table/ClassScheduleReportTable';

function ReportsPage() {
  const [reportType, setReportType] = useState<string>('');
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleGenerateReport = () => {
    if (reportType) {
      setReportGenerated(true);
    } else {
      alert("Please select a report type first.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Generate Reports</h1>
        {reportGenerated && (
            <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md">
                <Download size={18} />
                Export Report
            </Button>
        )}
      </div>

      {/* Report Controls */}
      <Card className="mb-8 shadow-sm md:w-[365px] bg-white">
        <CardHeader>
          <CardTitle className="text-xl">Report Controls</CardTitle>
          <p className="text-sm text-gray-500">Select report type and apply filters to generate your report.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select a report..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="faculty"><div className="flex items-center gap-2"><Users size={16} className="text-gray-500"/> Faculty Report</div></SelectItem>
                <SelectItem value="class_schedule"><div className="flex items-center gap-2"><BookOpen size={16} className="text-gray-500"/> Class Schedule Report</div></SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-date" className="text-xs font-medium text-gray-600">From</label>
                  <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border-gray-300 bg-white"/>
                </div>
                <div>
                  <label htmlFor="end-date" className="text-xs font-medium text-gray-600">To</label>
                  <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border-gray-300 bg-white"/>
                </div>
            </div>
          </div>
          <div className="md:self-end"><Button onClick={handleGenerateReport} className="w-full font-bold py-3">Generate Report</Button></div>
        </CardContent>
      </Card>
      
      {/* Generated Report Section */}
      {reportGenerated ? (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 md:w-[365px]">
          
            
              <StatCard 
                title="Total Faculty" 
                value="150" 
                change="+5 from last month" 
                icon={<Users />} 
                iconBgColor="bg-gradient-to-br from-blue-500 to-indigo-600"
                borderColor="border-indigo-600"
              />

              <StatCard 
                title="Total Classes" 
                value="320" 
                change="+12% from last semester" 
                icon={<BookOpen />} 
                iconBgColor="bg-gradient-to-br from-green-500 to-teal-600"
                borderColor="border-teal-600"
              />

              <StatCard 
                title="Scheduled Hours" 
                value="1,240" 
                change="This week" 
                icon={<CalendarIcon />} 
                iconBgColor="bg-gradient-to-br from-amber-500 to-orange-600"
                borderColor="border-orange-600"
              />
            </div>
         
          
          {/* Bar Chart */}
          <Card className="shadow-sm md:w-[365px]" >
            <CardContent className="p-0">
              <BarChart reportType={reportType} />
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl overflow-hidden md:w-[365px]">
            <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 border-b bg-gray-50/50">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Detailed {reportType === 'faculty' ? 'Faculty' : 'Class Schedule'} Report
                </CardTitle>
                <CardDescription className="mt-1">
                  A comprehensive list of all generated records.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {reportType === 'faculty' && <FacultyReportTable />}
              {reportType === 'class_schedule' && <ClassScheduleReportTable />}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg border-2 border-dashed">
          <h3 className="text-xl font-semibold text-gray-700">Your reports will appear here</h3>
          <p className="text-gray-500 mt-2">Select a report type and click "Generate Report" to get started.</p>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;