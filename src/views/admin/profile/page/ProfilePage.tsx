import { User, Mail, Phone, MapPin, Users, BookOpen, Building2, Edit, CheckCircle, Calendar } from 'lucide-react';

// Reusable component para sa stat card
const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-5">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

// Reusable component para sa information item
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string; }) => (
    <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
           {icon}
        </div>
        <div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="font-semibold text-slate-700">{value}</p>
        </div>
    </div>
);


function ProfilePage() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { name: 'Admin', email: 'admin@facultyscheduler.com' };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* --- Profile Banner --- */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-slate-800 to-slate-900" />
                <div className="p-6">
                    <div className="flex items-end -mt-20">
                        <img 
                            src={`https://i.pravatar.cc/150?u=${user.email}`} 
                            alt="Admin Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <div className="ml-6">
                            <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
                            <p className="text-slate-500 font-medium">Administrator</p>
                        </div>
                        <button className="ml-auto px-5 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition flex items-center gap-2">
                           <Edit size={16} /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>
            
            {/* --- Stats Grid --- */}
            <div className="grid grid-cols-3 md:grid-cols-1 gap-6">
                <StatCard icon={<Users size={28} className="text-white"/>} label="Faculties Managed" value={45} color="bg-sky-500" />
                <StatCard icon={<BookOpen size={28} className="text-white"/>} label="Total Courses" value={120} color="bg-emerald-500" />
                <StatCard icon={<Building2 size={28} className="text-white"/>} label="Rooms Available" value={32} color="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* --- Left Column: About and Contact --- */}
                <div className="lg:col-span-1 space-y-8">
                     <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80">
                        <h3 className="text-xl font-bold text-slate-800 mb-5">About</h3>
                        <p className="text-slate-600 text-sm">
                            System administrator responsible for managing faculty schedules, course data, and overall system integrity. Ensuring a smooth and efficient scheduling process for the institution.
                        </p>
                     </div>
                     <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80">
                        <h3 className="text-xl font-bold text-slate-800 mb-5">Contact Information</h3>
                        <div className="space-y-4">
                            <InfoItem icon={<User size={20} />} label="Full Name" value={user.name} />
                            <InfoItem icon={<Mail size={20} />} label="Email Address" value={user.email} />
                            <InfoItem icon={<Phone size={20} />} label="Phone" value="+1 (555) 123-4567" />
                            <InfoItem icon={<MapPin size={20} />} label="Location" value="Main Admin Office" />
                        </div>
                     </div>
                </div>

                {/* --- Right Column: Activity Timeline --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80">
                    <h3 className="text-xl font-bold text-slate-800 mb-5">Recent Activity</h3>
                    <ol className="relative border-l border-slate-200 space-y-8">                  
                        <li className="ml-6">            
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-emerald-200 rounded-full -left-3 ring-4 ring-white">
                                <Users size={14} className="text-emerald-700"/>
                            </span>
                            <h4 className="flex items-center mb-1 text-md font-semibold text-slate-900">Added New Faculty</h4>
                            <time className="block mb-2 text-xs font-normal leading-none text-slate-400">2 days ago</time>
                            <p className="text-sm text-slate-600">Successfully added Dr. Aliyah Khan to the system.</p>
                        </li>
                        <li className="ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-sky-200 rounded-full -left-3 ring-4 ring-white">
                                <Calendar size={14} className="text-sky-700"/>
                            </span>
                            <h4 className="flex items-center mb-1 text-md font-semibold text-slate-900">Generated Semester Schedule</h4>
                            <time className="block mb-2 text-xs font-normal leading-none text-slate-400">5 days ago</time>
                            <p className="text-sm text-slate-600">Generated and published the master schedule for Fall 2025.</p>
                        </li>
                         <li className="ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-indigo-200 rounded-full -left-3 ring-4 ring-white">
                                <CheckCircle size={14} className="text-indigo-700"/>
                            </span>
                            <h4 className="flex items-center mb-1 text-md font-semibold text-slate-900">System Update Completed</h4>
                            <time className="block mb-2 text-xs font-normal leading-none text-slate-400">Last week</time>
                            <p className="text-sm text-slate-600">Updated the system to version 2.1.0.</p>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;