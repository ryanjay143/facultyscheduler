import Header from "../layouts/Header"
import CourseTable from "./Curriculum/Curriculum"



function CourseContainer() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div>
        <Header />
      </div>
     

      {/* Main dashboard content */}
       <main className="flex-1 overflow-y-auto p-4 md:p-0">
        <CourseTable />
      </main>
    </div>
      
   
  )
}

export default CourseContainer
