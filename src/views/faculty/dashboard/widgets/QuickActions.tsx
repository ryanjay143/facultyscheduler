// src/components/widgets/QuickActions.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart3, Bell, ArrowRight } from 'lucide-react';

const actions = [
    { title: "View Full Schedule", icon: Calendar, color: "text-sky-500" },
    { title: "Check Teaching Load", icon: BarChart3, color: "text-amber-500" },
    { title: "See All Announcements", icon: Bell, color: "text-emerald-500" },
]

function QuickActions() {
    return (
        <Card className="shadow-lg rounded-2xl border border-gray-100">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {actions.map((action, index) => (
                        <Button key={index} variant="ghost" className="w-full justify-start h-12 text-md">
                           <action.icon size={20} className={`mr-4 ${action.color}`} />
                           {action.title}
                           <ArrowRight size={16} className="ml-auto text-gray-400" />
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default QuickActions;