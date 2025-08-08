import { useState } from "react";
import Header from "../layouts/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Megaphone, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// --- Dummy Data para sa mga Anunsyo ---
const dummyAnnouncements = [
    { id: 1, title: "Midterm Examination Schedule Release", audience: "All Users", status: "Published", date: "August 5, 2025" },
    { id: 2, title: "Faculty Development Seminar on AI in Education", audience: "Faculty Only", status: "Published", date: "August 4, 2025" },
    { id: 3, title: "System Maintenance this Weekend (Aug 9-10)", audience: "All Users", status: "Draft", date: "August 2, 2025" },
    { id: 4, title: "Enrollment for Next Semester is Now Open", audience: "Students Only", status: "Published", date: "August 1, 2025" },
];

// --- Color-coding para sa mga Badges ---
const audienceColors: Record<string, string> = {
    "All Users": "bg-blue-100 text-blue-800",
    "Faculty Only": "bg-amber-100 text-amber-800",
    "Students Only": "bg-emerald-100 text-emerald-800",
};
const statusColors: Record<string, string> = {
    Published: "bg-green-100 text-green-800",
    Draft: "bg-gray-200 text-gray-800",
};


function Announcement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        
        {/* --- Header Section sa Page --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center gap-3">
                <Megaphone className="w-8 h-8 text-purple-600" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Manage Announcements</h1>
                    <p className="text-gray-500 mt-1">Create, edit, and publish announcements.</p>
                </div>
            </div>
            <Button onClick={() => setIsDialogOpen(true)} className="mt-4 md:mt-0 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition">
                <PlusCircle className="w-5 h-5" />
                Create Announcement
            </Button>
        </div>

        {/* --- Announcement Table --- */}
        <div className="bg-white rounded-md shadow-lg border border-gray-200/80 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-[50%] font-bold">Title</TableHead>
                        <TableHead className="font-bold">Audience</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="font-bold">Date Published</TableHead>
                        <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dummyAnnouncements.map((ann) => (
                        <TableRow key={ann.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium text-gray-800">{ann.title}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={audienceColors[ann.audience]}>{ann.audience}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={statusColors[ann.status]}>{ann.status}</Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">{ann.date}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600">
                                    <Pencil size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                    <Trash2 size={16} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </div>

      {/* --- Dialog para sa Paghimo og Announcement --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Create New Announcement</DialogTitle>
                <DialogDescription>Fill in the details below. Click publish when you're ready.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="title" className="text-right font-medium">Title</label>
                    <Input id="title" placeholder="e.g., Midterm Exam Schedule" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                    <label htmlFor="content" className="text-right font-medium mt-2">Content</label>
                    <Textarea id="content" placeholder="Type your announcement content here." className="col-span-3 min-h-[150px]" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="audience" className="text-right font-medium">Audience</label>
                    <Select>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="faculty">Faculty Only</SelectItem>
                            <SelectItem value="students">Students Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter className="gap-2">
                <Button className="bg-gray-200 hover:bg-gray-300" variant="outline" onClick={() => setIsDialogOpen(false)}>Save as Draft</Button>
                <Button className="bg-purple-600 hover:bg-purple-700">Publish Now</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Announcement;