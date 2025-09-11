import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
    PlusCircle, 
    Search, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Megaphone,
    Filter
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Header from "../layouts/Header"; // Make sure this path is correct

// --- TYPE DEFINITIONS & MOCK DATA ---
type Audience = "All Users" | "Faculty Only" | "Students Only";
type Status = "Published" | "Draft";

interface Announcement {
  id: number;
  title: string;
  content: string;
  audience: Audience;
  status: Status;
  date: string;
}

const initialAnnouncements: Announcement[] = [
    { id: 1, title: "Midterm Examination Schedule Release", content: "The midterm examination schedule for all departments has been released. Please check the student portal for your respective schedules.", audience: "All Users", status: "Published", date: "August 5, 2025" },
    { id: 2, title: "Faculty Development Seminar on AI in Education", content: "All faculty members are invited to a seminar on integrating AI into the curriculum. It will be held on August 15, 2025, at the main auditorium.", audience: "Faculty Only", status: "Published", date: "August 4, 2025" },
    { id: 3, title: "System Maintenance this Weekend (Aug 9-10)", content: "The university portal will be temporarily unavailable this weekend for scheduled maintenance.", audience: "All Users", status: "Draft", date: "August 2, 2025" },
    { id: 4, title: "Enrollment for Next Semester is Now Open", content: "Enrollment for the upcoming semester is officially open. Please complete the process before the deadline on August 20, 2025.", audience: "Students Only", status: "Published", date: "August 1, 2025" },
];

const audienceColors: Record<Audience, string> = {
    "All Users": "bg-blue-100 text-blue-800",
    "Faculty Only": "bg-amber-100 text-amber-800",
    "Students Only": "bg-emerald-100 text-emerald-800",
};

const statusColors: Record<Status, string> = {
    Published: "bg-green-100 text-green-800",
    Draft: "bg-gray-200 text-gray-800",
};

// --- MAIN COMPONENT ---
function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ audience: 'All', status: 'All' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // --- DERIVED STATE & MEMOIZATION ---
  const filteredData = useMemo(() => {
    return announcements
      .filter(ann => ann.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(ann => filters.audience === 'All' || ann.audience === filters.audience)
      .filter(ann => filters.status === 'All' || ann.status === filters.status);
  }, [announcements, searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // --- HANDLER FUNCTIONS ---
  const handleAdd = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };
  
  const handleDelete = (announcementId: number) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter(a => a.id !== announcementId));
    }
  };

  const handleSave = (announcementData: Omit<Announcement, 'id' | 'date'>, newStatus: Status) => {
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    if (editingAnnouncement) {
      setAnnouncements(announcements.map(a => a.id === editingAnnouncement.id ? { ...editingAnnouncement, ...announcementData, status: newStatus, date: currentDate } : a));
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now(),
        ...announcementData,
        status: newStatus,
        date: currentDate,
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }
    setIsModalOpen(false);
  };
  
  const audiences: (Audience | 'All')[] = ['All', 'All Users', 'Faculty Only', 'Students Only'];
  const statuses: (Status | 'All')[] = ['All', 'Published', 'Draft'];

  return (
    <div className="flex flex-col h-screen bg-gray-50/50">
      <Header />
      
      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 ">
        <header className="mb-6 flex items-center gap-4">
          <Megaphone className="w-10 h-10 text-purple-600" />
          <div>
              <h1 className="text-4xl font-bold text-gray-800">Announcements</h1>
              <p className="text-gray-500 mt-1">Create, publish, and manage communications.</p>
          </div>
        </header>

        <Button onClick={handleAdd} className="w-full mt-2 mb-4"><PlusCircle className="h-4 w-4 mr-2" />Create</Button>

         <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg md:w-full border-b-4 border-primary">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
               <Input
                  placeholder="Search by title..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
              />
            </div>
            <div className="flex flex-row items-center gap-2 w-full md:w-auto">
              <Select value={filters.audience} onValueChange={v => { setFilters(f => ({...f, audience: v as Audience | 'All'})); setCurrentPage(1); }}>
                <SelectTrigger className="w-full md:w-48"><Filter className="h-4 w-4 mr-2 text-gray-500"/>{filters.audience === 'All' ? 'All Audiences' : filters.audience}</SelectTrigger>
                <SelectContent>{audiences.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={filters.status} onValueChange={v => { setFilters(f => ({...f, status: v as Status | 'All'})); setCurrentPage(1); }}>
                <SelectTrigger className="w-full md:w-40"><Filter className="h-4 w-4 mr-2 text-gray-500"/>{filters.status === 'All' ? 'All Statuses' : filters.status}</SelectTrigger>
                <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[50%]">Title</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-center w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-gray-500">No announcements found.</TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map(ann => (
                    <TableRow key={ann.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-semibold text-gray-800">{ann.title}</TableCell>
                      <TableCell><Badge variant="outline" className={`${audienceColors[ann.audience]} border-none`}>{ann.audience}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`${statusColors[ann.status]} border-none`}>{ann.status}</Badge></TableCell>
                      <TableCell className="text-gray-600 hidden md:table-cell">{ann.date}</TableCell>
                      <TableCell className="text-center">
                        <button onClick={() => handleEdit(ann)} title="Edit" className="p-2 text-gray-500 hover:text-blue-600 transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(ann.id)} title="Delete" className="p-2 text-gray-500 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
           <div className="flex flex-row md:flex-col justify-between items-center mt-6 text-sm gap-4">
             <p className="text-gray-600">Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries</p>
             <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4 mr-1"/>Previous</Button>
                  <span className="font-medium">{currentPage} of {totalPages || 1}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}><ChevronRight className="h-4 w-4 ml-1"/>Next</Button>
             </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AnnouncementFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingAnnouncement}
      />
    </div>
  );
}

// --- REUSABLE MODAL FORM COMPONENT ---
type AnnouncementFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Announcement, 'id' | 'date'>, newStatus: Status) => void;
  initialData: Announcement | null;
}

function AnnouncementFormModal({ isOpen, onClose, onSave, initialData }: AnnouncementFormModalProps) {
  const [formData, setFormData] = useState<Omit<Announcement, 'id' | 'date'>>({
    title: '', content: '', audience: 'All Users', status: 'Draft'
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: '', content: '', audience: 'All Users', status: 'Draft' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (newStatus: Status) => {
    onSave(formData, newStatus);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSelectChange = (value: Audience) => {
    setFormData(prev => ({...prev, audience: value}));
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{initialData ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
          <DialogDescription>Fill in the details below. Click publish or save as draft when you're ready.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">Content</Label>
            <Textarea id="content" name="content" value={formData.content} onChange={handleChange} className="col-span-3 min-h-[150px]" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="audience" className="text-right">Audience</Label>
            <Select value={formData.audience} onValueChange={handleSelectChange}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Users">All Users</SelectItem>
                <SelectItem value="Faculty Only">Faculty Only</SelectItem>
                <SelectItem value="Students Only">Students Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button type="button" variant="outline" onClick={() => handleSubmit('Draft')}>Save as Draft</Button>
            <Button type="button" className="bg-purple-600 hover:bg-purple-700" onClick={() => handleSubmit('Published')}>Publish Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AnnouncementPage;