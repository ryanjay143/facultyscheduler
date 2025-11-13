// src/components/modal/FacultyFormModal.tsx

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";
import type { Faculty } from "../table/FacultyTable";
import { toast } from "sonner";
import axios from "../../../../plugin/axios";

interface FacultyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faculty: Faculty) => void;
  initialData: Faculty | null;
  expertiseOptions: string[];
}

const expertiseColorPalette = [
    { bg: "bg-blue-100", text: "text-blue-800" }, { bg: "bg-emerald-100", text: "text-emerald-800" },
    { bg: "bg-amber-100", text: "text-amber-800" }, { bg: "bg-rose-100", text: "text-rose-800" },
    { bg: "bg-indigo-100", text: "text-indigo-800" }, { bg: "bg-cyan-100", text: "text-cyan-800" },
    { bg: "bg-pink-100", text: "text-pink-800" },
];
const getStringHash = (str: string) => { let hash = 0; for (let i = 0; i < str.length; i++) { hash = (hash << 5) - hash + str.charCodeAt(i); hash |= 0; } return Math.abs(hash); };

export function FacultyFormModal({ isOpen, onClose, onSave, initialData, expertiseOptions }: FacultyFormModalProps) {
  const [formData, setFormData] = useState<Omit<Faculty, "id" | "role">>({
    name: "", email: "", designation: "", department: "", expertise: [],
    status: "Active", avatar: "", deload_units: 0, teaching_load_units: 0, overload_units: 0,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // GI-ADD: State para sa image preview
  const [availableExpertise, setAvailableExpertise] = useState<string[]>(expertiseOptions);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
        setIsLoadingDepartments(true);
        const token = localStorage.getItem('accessToken');
        if (!token) { toast.error("Authentication required."); setIsLoadingDepartments(false); return; }
        try {
            const response = await axios.get('/department-program', { headers: { 'Authorization': `Bearer ${token}` } });
            const programList: any[] = Array.isArray(response.data.programs) ? response.data.programs : Object.values(response.data.programs || {});
            const departmentNames = [...new Set(programList.map(p => p.program_name))];
            setDepartmentOptions(departmentNames.sort());
        } catch (error) {
            toast.error("Failed to fetch departments.");
        } finally {
            setIsLoadingDepartments(false);
        }
    };
    if (isOpen) { fetchDepartments(); }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImagePreview(initialData.avatar || null);
      setAvailableExpertise(expertiseOptions.filter(opt => !initialData.expertise.includes(opt)));
    } else {
      const defaultAvatar = `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100)}`;
      setFormData({
        name: "", designation: "", expertise: [], department: "", email: "", status: "Active",
        avatar: defaultAvatar, deload_units: 0, teaching_load_units: 0, overload_units: 0,
      });
      setImagePreview(defaultAvatar);
      setAvailableExpertise(expertiseOptions);
    }
  }, [initialData, isOpen, expertiseOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue: string | number = value;
    if (['deload_units', 'teaching_load_units', 'overload_units'].includes(name)) {
        let numericValue = Number(value);
        if (name === 'teaching_load_units' && numericValue > 24) {
            toast.warning("Teaching load cannot exceed 24 units.");
            numericValue = 24;
        }
        finalValue = numericValue < 0 ? 0 : (value === '' ? '' : numericValue);
    }
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSelectChange = (name: "department" | "designation", value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImagePreview(URL.createObjectURL(file)); }
  };

  const handleAddExpertise = (newExpertise: string) => {
    if (newExpertise && !formData.expertise.includes(newExpertise)) {
      setFormData((prev) => ({ ...prev, expertise: [...prev.expertise, newExpertise].sort() }));
      setAvailableExpertise((prev) => prev.filter((exp) => exp !== newExpertise));
    }
  };

  const handleRemoveExpertise = (expertiseToRemove: string) => {
    setFormData((prev) => ({ ...prev, expertise: prev.expertise.filter((exp) => exp !== expertiseToRemove) }));
    if (!availableExpertise.includes(expertiseToRemove)) {
      setAvailableExpertise((prev) => [...prev, expertiseToRemove].sort());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let roleValue: number;
    switch (formData.designation) {
        case "Dean": roleValue = 0; break;
        case "Program Head": roleValue = 1; break;
        case "Faculty": roleValue = 2; break;
        default: toast.error("Invalid designation."); setIsLoading(false); return;
    }

    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('email', formData.email);
    dataToSend.append('role', String(roleValue));
    dataToSend.append('designation', formData.designation);
    dataToSend.append('department', formData.department);
    dataToSend.append('deload_units', String(formData.deload_units || 0));
    dataToSend.append('t_load_units', String(formData.teaching_load_units || 0));
    dataToSend.append('overload_units', String(formData.overload_units || 0));
    formData.expertise.forEach(exp => dataToSend.append('expertise[]', exp));

    const avatarInput = document.getElementById('avatar-file') as HTMLInputElement;
    if (avatarInput?.files?.[0]) { dataToSend.append('avatar', avatarInput.files[0]); }
    
    const token = localStorage.getItem('accessToken');
    if (!token) { toast.error("Authentication required."); setIsLoading(false); return; }
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };

    try {
        const isEditing = !!initialData;
        const url = isEditing ? `/faculties/${initialData.id}` : '/faculties';
        if (isEditing) { dataToSend.append('_method', 'PUT'); }
        
        const response = await axios.post(url, dataToSend, { headers });
        toast.success(response.data.message || 'Faculty saved successfully!');
        
        const savedApiData = response.data.faculty;
        const resultFaculty: Faculty = {
            id: savedApiData.id,
            name: savedApiData.user?.name || 'N/A',
            email: savedApiData.user?.email || 'N/A',
            role: savedApiData.user?.role,
            designation: savedApiData.designation || '',
            department: savedApiData.department || '',
            status: savedApiData.status === 0 ? "Active" : "Inactive",
            avatar: savedApiData.profile_picture ? `${import.meta.env.VITE_URL}/${savedApiData.profile_picture}` : `https://avatar.iran.liara.run/public/boy?username=${(savedApiData.user?.name || '').replace(/\s/g, '')}`,
            expertise: savedApiData.expertises?.map((exp: any) => exp.list_of_expertise) || [],
            deload_units: savedApiData.deload_units || 0,
            teaching_load_units: savedApiData.t_load_units || 0,
            overload_units: savedApiData.overload_units || 0,
        };
        onSave(resultFaculty);
        onClose();
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errors = error.response.data.errors as Record<string, string[]>;
            if (errors) {
                const firstError = Object.values(errors)[0][0];
                toast.error(firstError);
            } else {
                toast.error(error.response.data.message || "An error occurred.");
            }
        } else {
            toast.error("Failed to connect to the server.");
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">{initialData ? "Edit Faculty" : "Add New Faculty"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="py-4 space-y-6">
              <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-5">
                    {/* GI-UPDATE: Ang hulagway gihimo nang clickable */}
                    <button type="button" onClick={() => imagePreview && setIsPreviewModalOpen(true)} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full disabled:cursor-not-allowed" disabled={!imagePreview} title="Click to preview image">
                      <img src={imagePreview || 'https://via.placeholder.com/80'} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border-2 border-border cursor-pointer hover:opacity-80 transition-opacity"/>
                    </button>
                    <div className="flex-1">
                        <Input id="avatar-file" type="file" accept="image/png, image/jpeg" onChange={handleImageChange} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"/>
                        <p className="text-xs text-muted-foreground mt-2">PNG or JPG. Max 2MB.</p>
                    </div>
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
                  <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
                  <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Select value={formData.designation} onValueChange={(value) => handleSelectChange("designation", value)} required>
                          <SelectTrigger><SelectValue placeholder="Select a designation" /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Dean">Dean</SelectItem>
                              <SelectItem value="Program Head">Program Head</SelectItem>
                              <SelectItem value="Faculty">Faculty</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select value={formData.department} onValueChange={(v) => handleSelectChange("department", v)} required>
                          <SelectTrigger disabled={isLoadingDepartments}>
                              <SelectValue placeholder={isLoadingDepartments ? "Loading..." : "Select a department"} />
                          </SelectTrigger>
                          <SelectContent>
                              {departmentOptions.length > 0 ? (
                                  departmentOptions.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))
                              ) : (
                                  <div className="p-4 text-center text-sm text-muted-foreground">{isLoadingDepartments ? "Loading..." : "No departments."}</div>
                              )}
                          </SelectContent>
                      </Select>
                  </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
                  <div className="space-y-2"><Label htmlFor="deload_units">Deload Units</Label><Input id="deload_units" name="deload_units" type="number" value={formData.deload_units || ''} onChange={handleChange} placeholder="0" /></div>
                  <div className="space-y-2">
                      <Label htmlFor="teaching_load_units">Teaching Load</Label>
                      <Input id="teaching_load_units" name="teaching_load_units" type="number" value={formData.teaching_load_units || ''} onChange={handleChange} placeholder="e.g. 18" />
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><AlertCircle size={12} /> Max load is 24 units.</p>
                  </div>
                  <div className="space-y-2"><Label htmlFor="overload_units">Overload Units</Label><Input id="overload_units" name="overload_units" type="number" value={formData.overload_units || ''} onChange={handleChange} placeholder="0" /></div>
              </div>
              
              <div className="space-y-2">
                  <Label htmlFor="expertise">Expertise</Label>
                  <div className="flex flex-col p-2 w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <Select onValueChange={handleAddExpertise} value="">
                        <SelectTrigger className="border-t h-auto p-2 focus:ring-0 focus:ring-offset-0 justify-start text-primary hover:text-primary/90 font-medium">
                        <SelectValue placeholder="Click to add from the list..." /> 
                        </SelectTrigger>
                        <SelectContent>
                        {availableExpertise.length > 0 ? (
                            availableExpertise.sort().map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))
                        ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">All expertise selected.</div>
                        )}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-1.5 p-2 min-h-[2.5rem] items-center">
                        {formData.expertise.map((exp) => {
                            const colorIndex = getStringHash(exp) % expertiseColorPalette.length;
                            const color = expertiseColorPalette[colorIndex];
                            return (
                            <Badge key={exp} className={`font-normal hover:${color.bg} ${color.bg} hover:${color.text} ${color.text}`}>
                                {exp}
                                <button type="button" onClick={() => handleRemoveExpertise(exp)} className="ml-1.5 rounded-full hover:bg-black/10 p-0.5" aria-label={`Remove ${exp}`}>
                                <X size={14} />
                                </button>
                            </Badge>
                            );
                        })}
                    </div>
                  </div>
              </div>
              <DialogFooter className="mt-8 pt-4 border-t border-border">
                <DialogClose asChild><Button type="button" variant="outline" disabled={isLoading}>Cancel</Button></DialogClose>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Save Faculty')}</Button>
              </DialogFooter>
          </form>
          </DialogContent>
      </Dialog>
      
      {/* GI-ADD: Ang Modal para sa Image Preview */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-lg p-2 bg-transparent border-none shadow-none">
          <img src={imagePreview || ''} alt="Profile Preview Large" className="w-full h-auto rounded-lg object-contain max-h-[80vh]" />
        </DialogContent>
      </Dialog>
    </>
  );
}