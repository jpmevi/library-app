import "../styles/App.css";
import ResponsiveDrawer from "../components/Sidebar";
import AdminDashbaord from "./Admin/AdminDashboard";
function App() {
  return (
    <div className="appContainer">
      <ResponsiveDrawer />
      <AdminDashbaord />
    </div>
  );
}

export default App;
