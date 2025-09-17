import Header from "../layouts/Header"
import CourseTable from "./Curriculum/Curriculum"



function CourseContainer() {
  return (
    <>
    <div className="flex flex-col min-h-0 bg-gray-50">
        <Header />
      </div>
     

      
      <main className="flex-1 min-h-0 p-4 md:p-0">
        <CourseTable />
      </main>
    </>
    
  
      
   
  )
}

export default CourseContainer
