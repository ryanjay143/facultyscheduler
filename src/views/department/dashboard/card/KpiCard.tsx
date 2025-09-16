import React from 'react'

export const KpiCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm">
        <div className="flex items-center gap-4">
            <div>{icon}</div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);
