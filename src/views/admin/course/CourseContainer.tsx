import Header from "../layouts/Header"
import CourseTable from "./table/CourseTable"



function CourseContainer() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div>
        <Header />
      </div>
     

      {/* Main dashboard content */}
       <div className="flex-1 overflow-y-auto p-8">
        <CourseTable />
      </div>
    </div>
      
   
  )
}

export default CourseContainer
