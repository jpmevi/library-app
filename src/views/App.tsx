import "../styles/App.css";
import ResponsiveDrawer from "../components/Sidebar";
import AdminDashbaord from "./Admin/AdminDashboard";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
function App() {
  return (
    <div className="appContainer">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ResponsiveDrawer />
        <AdminDashbaord />
      </LocalizationProvider>
    </div>
  );
}

export default App;
