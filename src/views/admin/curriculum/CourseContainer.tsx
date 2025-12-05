import Curriculum from "./Curriculum";

function CourseContainer({ readOnly = false }: { readOnly?: boolean }) {
  return (
    <main>
      <Curriculum readOnly={readOnly} />
    </main>
  );
}

export default CourseContainer;