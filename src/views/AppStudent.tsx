import "../styles/App.css";
import StudentDashbaord from "./Student/StudentDashboard";
import ResponsiveDrawerStudent from "../components/SidebarStudent";
function AppStudent() {
  return (
    <div className="appContainer">
      <ResponsiveDrawerStudent />
      <StudentDashbaord />
    </div>
  );
}

export default AppStudent;
