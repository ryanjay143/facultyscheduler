import React, { useState } from 'react';
import { Camera } from 'lucide-react';

// Reusable component para sa matag setting section
const SettingsCard = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80">
        <div className="p-6 border-b border-slate-200/80">
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <div className="p-6 space-y-6">
            {children}
        </div>
        <div className="bg-slate-50/50 p-4 border-t border-slate-200/80 text-right rounded-b-2xl">
            <button className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all">
                Save Changes
            </button>
        </div>
    </div>
);

// Reusable component para sa input field
const InputField = ({ id, label, type, defaultValue, placeholder }: { id: string; label: string; type: string; defaultValue: string; placeholder?: string }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input type={type} id={id} defaultValue={defaultValue} placeholder={placeholder} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"/>
    </div>
);

// Reusable component para sa toggle switch
const ToggleSwitch = ({ id, label, enabled, setEnabled }: { id: string; label: string; enabled: boolean; setEnabled: (enabled: boolean) => void }) => (
    <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-slate-700 font-medium">{label}</label>
        <button onClick={() => setEnabled(!enabled)} id={id} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-indigo-600' : 'bg-slate-300'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

function FacultySettingsPage() {
    const [classCancellationNotif, setClassCancellationNotif] = useState(true);
    const [scheduleUpdateNotif, setScheduleUpdateNotif] = useState(true);

    const facultyString = localStorage.getItem('user'); // Assuming user is the faculty
    const faculty = facultyString ? JSON.parse(facultyString) : { name: 'Dr. Evelyn Reed', email: 'e.reed@university.edu' };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">My Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account preferences and information.</p>
            </div>

            {/* Personal Information */}
            <SettingsCard title="Personal Information" description="Keep your personal details up to date.">
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                        <img src={`https://i.pravatar.cc/150?u=${faculty.email}`} alt="Faculty Profile" className="w-24 h-24 rounded-full object-cover" />
                        <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-slate-100 transition">
                            <Camera size={18} className="text-slate-600"/>
                        </button>
                    </div>
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                       <InputField id="fullName" label="Full Name" type="text" defaultValue={faculty.name} />
                       <InputField id="title" label="Title / Position" type="text" defaultValue="Associate Professor" />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField id="officeLocation" label="Office Location" type="text" defaultValue="IT Building, Room 305" />
                    <InputField id="officeHours" label="Office Hours" type="text" defaultValue="MWF, 1:00 PM - 3:00 PM" />
                 </div>
            </SettingsCard>

            {/* Account Security */}
            <SettingsCard title="Account Security" description="Change your password regularly to keep your account secure.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField id="currentPassword" label="Current Password" type="password" defaultValue="••••••••" />
                    <InputField id="newPassword" label="New Password" type="password" placeholder="Enter new password" defaultValue="" />
                </div>
            </SettingsCard>

            {/* Notification Preferences */}
            <SettingsCard title="Notification Preferences" description="Choose how you receive important updates.">
                <ToggleSwitch id="class-cancellation" label="Class Cancellation Alerts" enabled={classCancellationNotif} setEnabled={setClassCancellationNotif} />
                <p className="text-xs text-slate-500 -mt-4 ml-1">Receive an email when one of your classes is cancelled by an admin.</p>
                <hr className="border-slate-200/80" />
                <ToggleSwitch id="schedule-update" label="Schedule Change Notifications" enabled={scheduleUpdateNotif} setEnabled={setScheduleUpdateNotif} />
                 <p className="text-xs text-slate-500 -mt-4 ml-1">Get notified about any changes to your teaching schedule, such as room reassignments.</p>
            </SettingsCard>
        </div>
    );
}

export default FacultySettingsPage;