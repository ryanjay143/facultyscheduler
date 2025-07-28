import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactElement; 
  iconBgColor: string; 
  borderColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, iconBgColor, borderColor }) => {
  return (
    <Card 
      className={`shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 ${borderColor}`}
    >
      <div className="relative p-6">
        {/* Large Gradient Icon in Background */}
        <div className={`absolute top-4 right-4 h-16 w-16 ${iconBgColor} text-white flex items-center justify-center rounded-xl opacity-80`}>
          {React.cloneElement(icon as React.ReactElement<any>, { className: "h-8 w-8" })}
        </div>
        
        {/* Card Content */}
        <CardHeader className="p-0">
          <CardTitle className="text-base font-medium text-gray-500">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-2">
          <p className="text-xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{change}</p>
        </CardContent>
      </div>
    </Card>
  );
};