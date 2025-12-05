// Example: src/hooks/useDashboardData.ts (Or simply in the main Dashboard component)

import { useState, useEffect } from 'react';
import axios from "../../../plugin/axios"; // Adjust path as necessary
import { toast } from 'sonner';

// Define the expected types based on the Laravel API response
interface WeeklyScheduleResponse {
  weeklyOverview: { MON: number; TUE: number; WED: number; THU: number; FRI: number; SAT: number };
  allClasses: {
    id: number;
    day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
    code: string;
    title: string;
    time: string;
    facultyName: string;
    room: string;
  }[];
}

interface FacultyLoadResponse {
    name: string;
    load: number;
}

interface KpiResponse {
    title: string;
    value: number | string;
    icon: string; // The name of the icon used in the frontend
}


export const useDashboardData = () => {
    const [kpiData, setKpiData] = useState<KpiResponse[]>([]);
    const [weeklyData, setWeeklyData] = useState<WeeklyScheduleResponse | null>(null);
    const [facultyLoad, setFacultyLoad] = useState<FacultyLoadResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        
        try {
            const [kpiRes, weeklyRes, loadRes] = await Promise.all([
                axios.get('/kpi', config),
                axios.get('/weekly-schedule', config),
                axios.get('/faculty-load', config),
            ]);

            setKpiData(kpiRes.data.data);
            setWeeklyData(weeklyRes.data);
            setFacultyLoad(loadRes.data.data);

        } catch (error) {
            console.error("Dashboard Data Fetch Error:", error);
            toast.error("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { kpiData, weeklyData, facultyLoad, loading };
}