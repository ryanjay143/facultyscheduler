import React, { useEffect, useState } from 'react';
// --- 1. THIS IS THE CORRECTED IMPORT ---
// No more 'next/dynamic'. Just a direct import.
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

// Define the props for our BarChart component
interface BarChartProps {
  reportType: 'faculty' | 'class_schedule' | string;
}

// Mock data for demonstration purposes
const facultyReportData = {
  categories: ["Computer Science", "Mathematics", "Physics", "Biology", "History"],
  series: [
    {
      name: "Faculty Members",
      data: [35, 22, 18, 25, 15],
    },
  ],
};

const classScheduleReportData = {
  categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  series: [
    {
      name: "Classes Scheduled",
      data: [65, 78, 82, 75, 90, 45],
    },
  ],
};

// --- Main BarChart Component ---
export const BarChart: React.FC<BarChartProps> = ({ reportType }) => {
  const [chartOptions, setChartOptions] = useState<ApexOptions>({});
  const [chartSeries, setChartSeries] = useState<{ name: string; data: number[] }[]>([]);

  useEffect(() => {
    const isFacultyReport = reportType === 'faculty';
    const data = isFacultyReport ? facultyReportData : classScheduleReportData;

    setChartSeries(data.series);
    
    setChartOptions({
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 8,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: data.categories,
        labels: {
          style: {
            colors: '#6b7280', // text-gray-500
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        title: {
          text: isFacultyReport ? 'Number of Faculty' : 'Number of Classes',
          style: {
            color: '#6b7280',
          },
        },
      },
      fill: {
        opacity: 1,
        colors: [isFacultyReport ? '#4f46e5' : '#10b981'], // Indigo for faculty, Green for classes
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + (isFacultyReport ? " members" : " classes");
          },
        },
      },
      title: {
        text: isFacultyReport ? 'Faculty Distribution by Department' : 'Weekly Class Distribution',
        align: 'left',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#374151', // text-gray-700
        },
      },
    });
  }, [reportType]);

  // --- 2. THE REST OF THE COMPONENT REMAINS THE SAME ---
  return (
    <div className="p-4 bg-white rounded-lg border">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
        width="100%"
      />
    </div>
  );
};