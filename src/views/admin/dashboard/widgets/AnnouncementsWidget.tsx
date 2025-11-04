import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Megaphone, ArrowRight } from "lucide-react";

  const recentAnnouncements = [
    { title: "Midterm Examination Schedule Released", date: "August 5, 2025" },
    { title: "Faculty Development Seminar", date: "August 4, 2025" },
    { title: "Enrollment for Next Semester Open", date: "August 1, 2025" },
  ];

  export function AnnouncementsWidget() {
    return (
      <Card className="shadow-lg rounded-2xl border-b-4 border-purple-500 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-50 blur-2xl" aria-hidden />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Megaphone size={18} />
            </span>
            <span className="text-gray-900">Recent Announcements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recentAnnouncements.slice(0,2).map((ann, index) => (
              <li key={index} className="group">
                <p className="font-semibold text-gray-800 text-sm group-hover:text-purple-700 transition-colors">
                  {ann.title}
                </p>
                <p className="text-xs text-gray-400">{ann.date}</p>
              </li>
            ))}
          </ul>
          {recentAnnouncements.length > 2 ? (
            <Button asChild variant="link" className="px-0 mt-4 text-purple-600 hover:text-purple-700">
              <a href="/facultyscheduler/admin/announcements" className="inline-flex items-center gap-1">See more <ArrowRight size={16} /></a>
            </Button>
          ) : (
            <Button variant="link" className="px-0 mt-4 text-purple-600 hover:text-purple-700">
              View All Announcements
              <ArrowRight size={16} className="ml-1" />
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }