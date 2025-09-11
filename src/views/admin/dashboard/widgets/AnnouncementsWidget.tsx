// src/components/widgets/AnnouncementsWidget.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, ArrowRight } from 'lucide-react';

const recentAnnouncements = [
    { title: "Midterm Examination Schedule Released", date: "August 5, 2025" },
    { title: "Faculty Development Seminar", date: "August 4, 2025" },
    { title: "Enrollment for Next Semester Open", date: "August 1, 2025" },
];

export function AnnouncementsWidget() {
    return (
        // --- The border style has been updated here ---
        <Card className="shadow-lg rounded-2xl border-b-4 border-purple-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Megaphone className="text-purple-500" />
                    <span>Recent Announcements</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {recentAnnouncements.map((ann, index) => (
                        <li key={index}>
                            <p className="font-semibold text-gray-800 text-sm">{ann.title}</p>
                            <p className="text-xs text-gray-400">{ann.date}</p>
                        </li>
                    ))}
                </ul>
                <Button variant="link" className="px-0 mt-4 text-purple-600">
                    View All Announcements
                    <ArrowRight size={16} className="ml-1" />
                </Button>
            </CardContent>
        </Card>
    )
}