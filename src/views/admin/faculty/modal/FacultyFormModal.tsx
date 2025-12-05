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
];

function getStringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function FacultyFormModal({ isOpen, onClose, onSave, initialData, expertiseOptions }: FacultyFormModalProps) {
  type FacultyFormData = Omit<Faculty, "id" | "role"> & {
    avatar?: string;
    deload_units?: number;
    teaching_load_units?: number;
    overload_units?: number;
  };

  const [formData, setFormData] = useState<FacultyFormData>({
    name: "",
    email: "",
    designation: "",
    department: "",
    expertise: [],
    status: "Active",
    avatar: "",
    profile_picture: "",
    deload_units: 0,
    teaching_load_units: 0,
    overload_units: 0,
    t_load_units: 0,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [availableExpertise, setAvailableExpertise] = useState<string[]>(expertiseOptions);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // NEW STATE FOR EXPERTISE INPUT & FOCUS
  const [newExpertiseInput, setNewExpertiseInput] = useState(""); 
  const [isExpertiseInputFocused, setIsExpertiseInputFocused] = useState(false);

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
      setImagePreview(initialData.profile_picture || null);
      setAvailableExpertise(expertiseOptions.filter(opt => !initialData.expertise.includes(opt)));
    } else {
      const defaultAvatar = `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100)}`;
      setFormData({
        name: "",
        designation: "",
        expertise: [],
        department: "",
        email: "",
        status: "Active",
        avatar: defaultAvatar,
        profile_picture: "",
        deload_units: 0,
        teaching_load_units: 0,
        overload_units: 0,
        t_load_units: 0,
      });
      setImagePreview(defaultAvatar);
      setAvailableExpertise(expertiseOptions);
    }
    setNewExpertiseInput(""); 
    setIsExpertiseInputFocused(false);
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
  
  const handleNewExpertiseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExpertiseInput(e.target.value);
  };

  const handleSelectExpertise = (expertise: string) => {
    const expertiseToProcess = expertise.trim();
    if (expertiseToProcess && !formData.expertise.includes(expertiseToProcess)) {
      setFormData((prev) => ({ ...prev, expertise: [...prev.expertise, expertiseToProcess].sort() }));
      
      if(availableExpertise.includes(expertiseToProcess)) {
          setAvailableExpertise((prev) => prev.filter((exp) => exp !== expertiseToProcess));
      }
    }
    setNewExpertiseInput(""); // Clear input after selection
  };

  const handleRemoveExpertise = (expertiseToRemove: string) => {
    setFormData((prev) => ({ ...prev, expertise: prev.expertise.filter((exp) => exp !== expertiseToRemove) }));
    if (expertiseOptions.includes(expertiseToRemove) && !availableExpertise.includes(expertiseToRemove)) {
      setAvailableExpertise((prev) => [...prev, expertiseToRemove].sort());
    }
  };

  // Filter logic for suggestions (now without the .slice(0, 5) limit)
  const filteredExpertise = availableExpertise
      .filter(exp => exp.toLowerCase().includes(newExpertiseInput.toLowerCase()))
      .sort();

  // Determine if the suggestion dropdown should be visible
  const showSuggestions = isExpertiseInputFocused && (newExpertiseInput.length > 0 || availableExpertise.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    // ... (unchanged handleSubmit function for brevity)
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
            profile_picture: savedApiData.profile_picture ? `${import.meta.env.VITE_URL}/${savedApiData.profile_picture}` : `https://avatar.iran.liara.run/public/boy?username=${(savedApiData.user?.name || '').replace(/\s/g, '')}`,
            expertise: savedApiData.expertises?.map((exp: any) => exp.list_of_expertise) || [],
            deload_units: savedApiData.deload_units || 0,
            t_load_units: savedApiData.t_load_units || 0,
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
              
              {/* UPDATED EXPERTISE FIELD (Token/Tag Input with Autocomplete/Suggestions) */}
              <div className="space-y-2">
                  <Label htmlFor="expertise-input">Expertise</Label>
                  <div className="relative">
                      {/* Token Input Area (Badges + Input) */}
                      <div className="flex flex-wrap items-center w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 min-h-10 p-1.5">
                          {/* Existing Badges Display */}
                          {formData.expertise.map((exp) => {
                              const colorIndex = getStringHash(exp) % expertiseColorPalette.length;
                              const color = expertiseColorPalette[colorIndex];
                              return (
                                  <Badge key={exp} className={`font-normal hover:${color.bg} ${color.bg} hover:${color.text} ${color.text} mr-1.5 mb-1.5`}>
                                      {exp}
                                      <button type="button" onClick={() => handleRemoveExpertise(exp)} className="ml-1.5 rounded-full hover:bg-black/10 p-0.5" aria-label={`Remove ${exp}`}>
                                          <X size={14} />
                                      </button>
                                  </Badge>
                              );
                          })}
                          
                          {/* Input field for typing/searching */}
                          <Input
                              id="expertise-input"
                              value={newExpertiseInput}
                              onChange={handleNewExpertiseInputChange}
                              onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newExpertiseInput.trim() !== '') {
                                      e.preventDefault();
                                      handleSelectExpertise(newExpertiseInput);
                                  }
                              }}
                              onFocus={() => setIsExpertiseInputFocused(true)}
                              onBlur={() => {
                                  // Delay onBlur so that click on suggestion can register
                                  setTimeout(() => setIsExpertiseInputFocused(false), 100);
                              }}
                              placeholder={formData.expertise.length === 0 ? "Type to add or select expertise..." : ""}
                              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0 flex-1 min-w-[50px] bg-transparent shadow-none"
                              autoComplete="off"
                          />
                      </div>

                      {/* Suggestions Dropdown */}
                      {showSuggestions && (
                          <div className="absolute z-10 w-full bg-popover border border-input rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                              
                              {/* Option to add new expertise (only if typing and it's not a suggestion) */}
                              {!formData.expertise.map(e => e.toLowerCase()).includes(newExpertiseInput.trim().toLowerCase()) && 
                               !availableExpertise.map(e => e.toLowerCase()).includes(newExpertiseInput.trim().toLowerCase()) &&
                               newExpertiseInput.trim() !== '' && (
                                  <div
                                      className="px-4 py-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 text-center border-b font-medium"
                                      onClick={() => handleSelectExpertise(newExpertiseInput)}
                                      onMouseDown={(e) => e.preventDefault()} 
                                  >
                                      Add New Expertise: **{newExpertiseInput.trim()}**
                                  </div>
                              )}

                              {/* Filtered/Available Expertise List */}
                              {filteredExpertise.length > 0 ? filteredExpertise.map((exp) => (
                                  <div
                                      key={exp}
                                      className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                      onClick={() => handleSelectExpertise(exp)}
                                      onMouseDown={(e) => e.preventDefault()} // Prevent blur from closing the list before the click registers
                                  >
                                      {exp}
                                  </div>
                              )) : newExpertiseInput.trim() === '' && (
                                <div className="p-4 text-center text-sm text-muted-foreground">All expertise selected.</div>
                              )}
                          </div>
                      )}
                  </div>
              </div>
              
              <DialogFooter className="mt-8 pt-4 border-t border-border">
                <DialogClose asChild><Button type="button" variant="outline" disabled={isLoading}>Cancel</Button></DialogClose>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Save Faculty')}</Button>
              </DialogFooter>
          </form>
          </DialogContent>
      </Dialog>
      
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-lg p-2 bg-transparent border-none shadow-none">
          <img src={imagePreview || ''} alt="Profile Preview Large" className="w-full h-auto rounded-lg object-contain max-h-[80vh]" />
        </DialogContent>
      </Dialog>
    </>
  );
}