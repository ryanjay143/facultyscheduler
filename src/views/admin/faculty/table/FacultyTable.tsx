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
import {
    PlusIcon,
    Search,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { X } from "lucide-react"; // Import X icon for removing badges

// --- TYPE DEFINITIONS & MOCK DATA ---
interface Faculty {
  id: number;
  name: string;
  designation: string;
  expertise: string[]; // Expertise is now an array of strings
  department: string;
  email: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

const initialFacultyData: Faculty[] = [
  { id: 1, name: "Dr. Alice Johnson", designation: "Professor", expertise: ["Software Engineering", "HCI"], department: "Computer Science", email: "alice.j@university.edu", status: "Active", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 2, name: "Prof. Bob Smith", designation: "Associate Professor", expertise: ["Cyber Security"], department: "Mathematics", email: "bob.s@university.edu", status: "Inactive", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 3, name: "Dr. Carol Lee", designation: "Professor", expertise: ["Computer Graphics & Vision", "Game Development"], department: "Physics", email: "carol.l@university.edu", status: "Active", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 4, name: "Dr. Emily Clark", designation: "Asst. Professor", expertise: ["Cyber Security", "Computer Networks"], department: "Computer Science", email: "emily.c@university.edu", status: "Active", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: 5, name: "Dr. Michael Brown", designation: "Department Head", expertise: ["Programming"], department: "History", email: "michael.b@university.edu", status: "Active", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
];

const statusColor = {
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-red-100 text-red-800",
};

// --- MAIN COMPONENT ---
function FacultyTable() {
  const [faculty, setFaculty] = useState<Faculty[]>(initialFacultyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ department: 'All', status: 'All' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);

  // --- DERIVED STATE & MEMOIZATION ---
  const filteredData = useMemo(() => {
    return faculty
      .filter(f => {
        const searchLower = searchTerm.toLowerCase();
        return (
          f.name.toLowerCase().includes(searchLower) ||
          f.department.toLowerCase().includes(searchLower) ||
          f.designation.toLowerCase().includes(searchLower) ||
          // Also search within the expertise array
          f.expertise.some(e => e.toLowerCase().includes(searchLower))
        );
      })
      .filter(f => filters.department === 'All' || f.department === filters.department)
      .filter(f => filters.status === 'All' || f.status === filters.status);
  }, [faculty, searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // --- HANDLER FUNCTIONS ---
  const handleAdd = () => {
    setEditingFaculty(null);
    setIsModalOpen(true);
  };

  const handleEdit = (facultyMember: Faculty) => {
    setEditingFaculty(facultyMember);
    setIsModalOpen(true);
  };

  const handleDelete = (facultyId: number) => {
    if (window.confirm("Are you sure you want to delete this faculty member?")) {
      setFaculty(faculty.filter(f => f.id !== facultyId));
    }
  };

  const handleSave = (facultyData: Omit<Faculty, 'id'>) => {
    if (editingFaculty) {
      setFaculty(faculty.map(f => f.id === editingFaculty.id ? { ...editingFaculty, ...facultyData } : f));
    } else {
      const newFaculty: Faculty = {
        id: Date.now(),
        ...facultyData,
      };
      setFaculty([newFaculty, ...faculty]);
    }
    setIsModalOpen(false);
  };

  const departments = ['All', ...Array.from(new Set(initialFacultyData.map(f => f.department)))];
  const statuses = ['All', 'Active', 'Inactive'];
  
  const expertiseOptions = [
      'Computer Networks',
      'HCI',
      'Computer Graphics & Vision',
      'Software Engineering',
      'Software Development',
      'Cyber Security',
      'Programming',
      'Game Development'
  ];

  return (
    <div className="p-3 bg-gray-50/50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Faculty Management</h1>
        <p className="text-gray-500 mt-1">Add, edit, and manage all faculty members.</p>
      </header>

       <Button onClick={handleAdd} className="w-full mt-2 mb-4"><PlusIcon className="h-4 w-4 mr-2" />Add Faculty</Button>

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg md:w-[400px] border-b-4 border-primary">
        <div className="flex flex-col gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <Input
                placeholder="Search faculty..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-auto">
            <Select value={filters.department} onValueChange={v => { setFilters(f => ({...f, department: v})); setCurrentPage(1); }}>
              <SelectTrigger className="w-full md:w-[360px]"><Briefcase className="h-4 w-4 mr-2 text-gray-500"/>{filters.department === 'All' ? 'All Departments' : filters.department}</SelectTrigger>
              <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={v => { setFilters(f => ({...f, status: v})); setCurrentPage(1); }}>
              <SelectTrigger className="w-full md:w-[360px]"><Filter className="h-4 w-4 mr-2 text-gray-500"/>{filters.status === 'All' ? 'All Statuses' : filters.status}</SelectTrigger>
              <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Faculty Member</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="hidden lg:table-cell">Expertise</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-500">No faculty members found.</TableCell>
                </TableRow>
              ) : (
                paginatedData.map((facultyMember) => (
                  <TableRow key={facultyMember.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="min-w-[250px]">
                      <div className="flex items-center gap-4">
                        <img
                          src={facultyMember.avatar}
                          alt={facultyMember.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div>
                            <p className="font-semibold text-gray-800">{facultyMember.name}</p>
                            <p className="text-sm text-gray-500">{facultyMember.designation}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[150px]">{facultyMember.department}</TableCell>
                    <TableCell className="text-gray-600 hidden lg:table-cell min-w-[200px]">
                        <div className="flex flex-wrap items-center gap-2">
                            {facultyMember.expertise.map(e => (
                                <Badge key={e} variant="secondary">{e}</Badge>
                            ))}
                        </div>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[facultyMember.status]}`}>
                        {facultyMember.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center min-w-[100px]">
                      <button onClick={() => handleEdit(facultyMember)} title="Edit" className="p-2 text-gray-500 hover:text-blue-600 transition-colors"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(facultyMember.id)} title="Delete" className="p-2 text-gray-500 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-row md:flex-col justify-between items-center mt-6 text-sm gap-4">
           <p className="text-gray-600 order-2 md:order-1">
               Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
           </p>
           <div className="flex items-center gap-2 order-1 md:order-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4 mr-1"/>Prev</Button>
                <span className="font-medium">{currentPage} of {totalPages || 1}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}><ChevronRight className="h-4 w-4 ml-1"/>Next</Button>
           </div>
        </div>
      </div>

      <FacultyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingFaculty}
        departments={departments.filter(d => d !== 'All')}
        expertiseOptions={expertiseOptions} 
      />
    </div>
  );
}

// --- REUSABLE MODAL FORM COMPONENT ---
type FacultyFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Faculty, 'id'>) => void;
  initialData: Faculty | null;
  departments: string[];
  expertiseOptions: string[];
}

function FacultyFormModal({ isOpen, onClose, onSave, initialData, departments, expertiseOptions }: FacultyFormModalProps) {
  const [formData, setFormData] = useState<Omit<Faculty, 'id'>>({
    name: '', designation: '', expertise: [], department: departments[0] || '', email: '', status: 'Active', avatar: ''
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ 
          name: '', 
          designation: '', 
          expertise: [], 
          department: departments[0] || '', 
          email: '', 
          status: 'Active', 
          avatar: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100)}` 
      });
    }
  }, [initialData, isOpen, departments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: 'department' | 'status', value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as any }));
  }

  // --- FIX START ---
  // This handler now receives a single string and adds it to the expertise array.
  const handleAddExpertise = (newExpertise: string) => {
    if (newExpertise && !formData.expertise.includes(newExpertise)) {
      setFormData(prev => ({ ...prev, expertise: [...prev.expertise, newExpertise] }));
    }
  };

  // This handler removes an expertise from the array.
  const handleRemoveExpertise = (expertiseToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== expertiseToRemove),
    }));
  };
  // --- FIX END ---

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[525px] overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{initialData ? 'Edit Faculty' : 'Add New Faculty'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="designation" className="text-right">Designation</Label>
              <Input id="designation" name="designation" value={formData.designation} onChange={handleChange} className="col-span-3" placeholder="e.g., Professor" required />
            </div>
             
             {/* --- FIX START: Expertise input is now a combination of Select and Badges --- */}
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="expertise" className="text-right pt-2">Expertise</Label>
              <div className="col-span-3">
                <Select onValueChange={handleAddExpertise}>
                  <SelectTrigger>
                    {/* The value prop is removed, so it acts as an action button */}
                    <SelectValue placeholder="Add an expertise..." />
                  </SelectTrigger>
                  <SelectContent >
                    {expertiseOptions.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-3 ">
                  {/* Ensure formData.expertise is an array before mapping */}
                  {Array.isArray(formData.expertise) && formData.expertise.map(exp => (
                    <Badge key={exp} variant="secondary" className="pl-3 pr-1 py-1 text-sm">
                      {exp}
                      <button
                        type="button"
                        onClick={() => handleRemoveExpertise(exp)}
                        className="ml-2 rounded-full hover:bg-gray-300 p-0.5"
                        aria-label={`Remove ${exp}`}
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            {/* --- FIX END --- */}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">Department</Label>
              <Select value={formData.department} onValueChange={v => handleSelectChange('department', v)}>
                <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select value={formData.status} onValueChange={v => handleSelectChange('status', v)}>
                <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar" className="text-right">Avatar URL</Label>
              <Input id="avatar" name="avatar" value={formData.avatar} onChange={handleChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FacultyTable;