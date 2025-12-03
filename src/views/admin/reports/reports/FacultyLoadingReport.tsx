import React, { useMemo, useState, useEffect } from "react";
// Assuming you have set up the alias for axios
import axios from '../../../../plugin/axios'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Loader2 } from "lucide-react"; 

// --- TYPESCRIPT INTERFACES --- 
interface User {
    id: number;
    name: string;
    email: string;
}

interface Faculty {
  id: number;
  user_id: number;
  designation: string;
  t_load_units: number;
  overload_units: number;
  deload_units: number;
  user: User; 
}

interface Subject {
  id: number;
  subject_code: string;
  des_title: string;
  lec_units: number;
  lab_units: number;
}

interface Room {
  id: number;
  roomNumber: string;
}

interface BackendLoading {
  id: number;
  faculty_id: number;
  subject_id: number;
  room_id: number;
  type: 'LEC' | 'LAB' | string;
  day: string;
  start_time: string;
  end_time: string;
  faculty: Faculty;
  subject: Subject;
  room: Room;
}

interface BackendResponse {
    success: boolean;
    facultyLoading: BackendLoading[];
}

interface SubjectItem {
    loadCode: string; 
    payingHours: number;
    day: string;
    time: string;
    room: string;
    remarks: string; 
    remarkRowSpan: number; 
}

interface GroupedFacultyLoad {
  facultyId: number;
  name: string;
  loadString: string; 
  calculatedLoad: number;
  preps: number; // FIXED: Naka-number na lang
  overload: number;
  subjects: SubjectItem[];
}

// --- UTILITY FUNCTIONS ---
const formatTime = (timeString: string): string => {
    try {
        const [hours, minutes] = timeString.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12; 
        return `${displayHours}:${String(minutes).padStart(2, '0')}${period}`;
    } catch (e) {
        return timeString;
    }
};

const transformToGroupedData = (backendData: BackendLoading[]): GroupedFacultyLoad[] => {
  const facultyMap = new Map<number, BackendLoading[]>();

  backendData.forEach(loading => {
    if (!facultyMap.has(loading.faculty_id)) {
      facultyMap.set(loading.faculty_id, []);
    }
    facultyMap.get(loading.faculty_id)!.push(loading);
  });

  const grouped: GroupedFacultyLoad[] = [];

  facultyMap.forEach(loadings => {
    const faculty = loadings[0].faculty;
    const facultyId = faculty.id;
    const facultyName = faculty.user.name;

    // FIXED: Calculate Preps (Count of unique subject descriptions/remarks)
    const uniqueSubjectTitles = new Set<string>();
    loadings.forEach(loading => uniqueSubjectTitles.add(loading.subject.des_title));
    
    // Ginamit ang count ng unique remarks
    const calculatedPreps = uniqueSubjectTitles.size; 

    const rawSubjectList = loadings.map(loading => {
        const payingHours = loading.type === 'LEC' 
                            ? loading.subject.lec_units 
                            : (loading.type === 'LAB' ? loading.subject.lab_units : 0);
        
        const startTime = formatTime(loading.start_time);
        const endTime = formatTime(loading.end_time);
        const remarksTitle = loading.subject.des_title;
        
        const subjectItem: SubjectItem = {
            // FIXED: loadCode for Load column
            loadCode: `${loading.subject.subject_code} ${loading.type}`,
            payingHours: payingHours,
            day: loading.day,
            time: `${startTime}-${endTime}`,
            room: loading.room.roomNumber,
            remarks: remarksTitle, 
            remarkRowSpan: 0, 
        };
        return subjectItem;
    });

    // 3. Calculate the actual rowSpan for the Remarks column
    const subjectList: SubjectItem[] = [];
    for (let i = 0; i < rawSubjectList.length; i++) {
        const currentItem = rawSubjectList[i];
        
        if (i === 0 || rawSubjectList[i].remarks !== rawSubjectList[i-1].remarks) {
            const currentRemark = currentItem.remarks;
            let remarkRowspan = 1;
            
            for (let j = i + 1; j < rawSubjectList.length; j++) {
                if (rawSubjectList[j].remarks === currentRemark) {
                    remarkRowspan++;
                } else {
                    break;
                }
            }
            currentItem.remarkRowSpan = remarkRowspan;
        }
        subjectList.push(currentItem);
    }

    const calculatedLoad = faculty.t_load_units; 
    const overload = faculty.overload_units;
    // FIXED: loadString is the total paying hours, naka-string para sa display format
    const loadString = rawSubjectList.reduce((sum, item) => sum + item.payingHours, 0).toString();

    grouped.push({
        facultyId,
        name: facultyName,
        loadString: loadString,
        calculatedLoad: calculatedLoad, 
        preps: calculatedPreps,
        overload: overload,
        subjects: subjectList,
    });
  });

  return grouped;
};


// --- REACT COMPONENT ---
export function FacultyLoadingReport() {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>("all");
  const [backendData, setBackendData] = useState<BackendLoading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = 'get-facultyLoading-reports';
  const TOKEN_KEY = 'accessToken'; 
  
  // 1. Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage("");

      const accessToken = localStorage.getItem(TOKEN_KEY);
      
      if (!accessToken) {
          setIsLoading(false);
          setIsError(true);
          setErrorMessage("Authentication token not found in Local Storage. Please log in.");
          return;
      }
      
      try {
        const response = await axios.get<BackendResponse>(API_URL, {
            headers: {
                'Authorization': `Bearer ${accessToken}`, 
                'Accept': 'application/json',
            }
        });

        const result = response.data;
        
        if (result.success && Array.isArray(result.facultyLoading)) {
            setBackendData(result.facultyLoading);
        } else {
             throw new Error('Invalid data structure or success: false received');
        }
      } catch (error) {
        console.error("Error fetching data with axios:", error);
        setIsError(true);
        if (axios.isAxiosError(error) && error.response) {
            setErrorMessage(`API Error: ${error.response.statusText} (${error.response.status}). Is the token valid?`);
        } else {
            setErrorMessage("Network error or failed to connect to the API.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); 

  // 2. Data Transformation
  const allGroupedData = useMemo(() => {
    return transformToGroupedData(backendData);
  }, [backendData]);

  // 3. Filtering
  const filteredLoadData = useMemo(() => {
    if (selectedFacultyId === "all") {
      return allGroupedData;
    }
    return allGroupedData.filter(block => block.facultyId.toString() === selectedFacultyId);
  }, [selectedFacultyId, allGroupedData]);
  
  // List of unique faculty for the Select dropdown
  const facultyDropdownOptions = useMemo(() => {
    const uniqueFaculties = new Set<{id: number, name: string}>();
    allGroupedData.forEach(block => uniqueFaculties.add({id: block.facultyId, name: block.name}));
    return Array.from(uniqueFaculties).map(f => ({ id: f.id, name: f.name }));
  }, [allGroupedData]);


  if (isLoading) {
    return (
        <div className="p-10 text-center flex flex-col items-center justify-center text-primary">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p>Loading faculty load reports...</p>
        </div>
    );
  }

  if (isError) {
    return (
        <div className="p-10 text-center text-destructive border border-destructive/50 rounded-lg">
            <h3 className="font-bold mb-2">Failed to Load Data</h3>
            <p>{errorMessage || "An unknown error occurred while fetching the data."}</p>
        </div>
    );
  }
  
  return (
    <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm border border-border">
      {/* Faculty Selection Filter */}
      <div className="flex justify-end mb-6">
        <Select value={selectedFacultyId} onValueChange={setSelectedFacultyId}>
          <SelectTrigger className="w-full md:w-64">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter by Faculty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Faculty</SelectItem>
            {facultyDropdownOptions.map((f) => <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table className="w-full">
            <TableHeader className="sticky top-0 bg-muted/90 z-10 border-b">
              <TableRow>
                <TableHead className="w-[100px] border-r">Name of Faculty</TableHead>
                <TableHead className="w-[100px] border-r">Load</TableHead>
                <TableHead className="text-center w-[100px] border-r">Paying Hours</TableHead>
                <TableHead className="w-[80px]">Day</TableHead>
                <TableHead className="w-[150px]">Time</TableHead>
                <TableHead className="w-[80px] border-r">Room</TableHead>
                <TableHead className="min-w-[250px] border-r">Remarks</TableHead>
                <TableHead className="w-[80px] text-right border-r">Total Load</TableHead>
                <TableHead className="w-[100px] text-center">Preps</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoadData.map((facultyBlock, fIndex) => {
                const rowCount = facultyBlock.subjects.length;
                const hasOverload = facultyBlock.overload > 0;
                const bgColor = fIndex % 2 === 1 ? 'bg-accent/10' : '';

                if (rowCount === 0) return null;

                return (
                  <React.Fragment key={facultyBlock.facultyId}>
                    {facultyBlock.subjects.map((subject, sIndex) => {
                      const isLastRow = sIndex === rowCount - 1;
                      const isFirstRow = sIndex === 0;
                      const showRemark = subject.remarkRowSpan > 0; 

                      return (
                        <TableRow 
                          key={`${facultyBlock.facultyId}-${sIndex}`} 
                          className={`${bgColor} ${isLastRow ? 'border-b-4 border-gray-300' : 'border-b border-border/50'}`}
                        >
                          {/* 1. Name of Faculty (RowSpan) */}
                          {isFirstRow && (
                            <TableCell rowSpan={rowCount} className="font-bold text-base align-top border-r whitespace-nowrap">
                              {facultyBlock.name}
                            </TableCell>
                          )}
                          
                          {/* 2. Load (FIXED: Subject Code per row) */}
                          <TableCell className="text-sm font-medium border-r uppercase">{subject.loadCode}</TableCell>
                          
                          {/* 3. Paying Hours, Day, Time, Room */}
                          <TableCell className="text-center font-medium border-r">{subject.payingHours || ""}</TableCell>
                          <TableCell className="text-sm">{subject.day}</TableCell>
                          <TableCell className="text-sm">{subject.time}</TableCell>
                          <TableCell className="text-sm border-r">{subject.room}</TableCell>
                          
                          {/* 4. Remarks (Subject Description) - Uses dynamic RowSpan */}
                          {showRemark && (
                              <TableCell rowSpan={subject.remarkRowSpan} className="text-sm text-muted-foreground border-r whitespace-normal align-top">
                                  {subject.remarks}
                              </TableCell>
                          )}
                          
                          {/* 5. Total Load (RowSpan) */}
                          {isFirstRow && (
                            <TableCell rowSpan={rowCount} className="text-center font-bold text-lg align-top border-r">
                              <div className="py-1">
                                <span className="text-xl font-bold">{facultyBlock.loadString}</span>
                                {hasOverload && (
                                    <div className="text-destructive font-semibold text-xs mt-1">overload {facultyBlock.overload}</div>
                                )}
                              </div>
                            </TableCell>
                          )}

                          {/* 6. Preps (RowSpan) */}
                          {isFirstRow && (
                            <TableCell rowSpan={rowCount} className="text-center align-top">
                              {/* Preps: count of unique remarks per faculty */}
                              {`${facultyBlock.preps} preps`}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                );
              })}
              
              {/* No Data Row */}
              {filteredLoadData.length === 0 && (
                <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                        No faculty load data found for the selected filter.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}