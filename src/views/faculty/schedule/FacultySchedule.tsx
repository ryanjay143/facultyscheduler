
import Header from "../layouts/Header"; // Assuming you have a Header component
import ViewSchedule from "./ViewSchedule";



// --- MAIN COMPONENT ---
function FacultySchedule() {
    
    

    return (
        <div className="flex flex-col h-screen bg-gray-50/50">
            <Header />

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
               <ViewSchedule />
            </main>
        </div>
    );
}

export default FacultySchedule;