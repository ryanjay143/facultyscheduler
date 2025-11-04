import ViewSchedule from "./ViewSchedule";

// --- MAIN COMPONENT ---
function FacultySchedule() {
  // Ang parent component (FacultyContainerLayouts) na ang bahala sa layout,
  // padding, ug scrolling. Ang trabaho lang aning componenta kay i-render ang main content.
  return (
    <ViewSchedule />
  );
}

export default FacultySchedule;