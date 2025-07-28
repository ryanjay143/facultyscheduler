import Header from "../layouts/Header"
import CourseTable from "./table/CourseTable"



function CourseContainer() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <Header />

      {/* Main dashboard content */}
      <div className="flex-1 p-8">
        <CourseTable />
      </div>
    </div>
      
   
  )
}

export default CourseContainer
