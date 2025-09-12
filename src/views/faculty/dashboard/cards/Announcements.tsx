// src/components/cards/Announcements.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, ArrowRight } from 'lucide-react';

const announcements = [
    { title: "Midterm Examination Schedule Released", date: "August 5, 2025" },
    { title: "Faculty Meeting on Friday", date: "August 4, 2025" },
    { title: "System Maintenance this Weekend", date: "August 2, 2025" },
];

function Announcements() {
  return (
    <Card className="shadow-lg rounded-2xl border border-gray-100">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <Megaphone className="text-purple-500" />
                <span>Announcements</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {announcements.map((item, index) => (
                    <li key={index} className="border-l-2 border-purple-200 pl-4">
                        <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.date}</p>
                    </li>
                ))}
            </ul>
            <Button variant="link" className="px-0 mt-4 text-purple-600 font-semibold">
                View All Announcements
                <ArrowRight size={16} className="ml-1" />
            </Button>
        </CardContent>
    </Card>
  );
}

export default Announcements;