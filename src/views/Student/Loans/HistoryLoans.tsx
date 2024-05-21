import { Delete } from "@mui/icons-material";
import CreateIcon from "@mui/icons-material/Create";
import StickyHeadTable, { Column } from "../../../components/Table";
import PaymentIcon from "@mui/icons-material/Payment";
import PaymentsIcon from "@mui/icons-material/Payments";
import ResponsiveDrawer from "../../../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/App.css";
import { IconButton, InputBase, createTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ResponsiveDrawerStudent from "../../../components/SidebarStudent";

function HistoryLoans() {
  const columns: Column[] = [
    { id: "id", label: "id", minWidth: 100, align: "center" },
    { id: "studentId", label: "User Id", minWidth: 100, align: "center" },
    { id: "bookName", label: "Book Name", minWidth: 100, align: "center" },
    { id: "isbnCode", label: "ISBN Code", minWidth: 100, align: "center" },
    { id: "loanDate", label: "Loan Date", minWidth: 150, align: "center" },
  ];
  const careername = localStorage.getItem("careername");
  const auth = localStorage.getItem("auth");
  const accountNumber = localStorage.getItem("accountNumber");
  const navigate = useNavigate();
  interface Career {
    amount: number;
    bookName: string;
    id: number;
    isbnCode: string;
    loanDate: string;
    studentId: number;
  }
  const username = localStorage.getItem("username");
  const [careers, setCareers] = useState<Career[]>([]);
  const [startDate, setStartDate] = useState<string>(new Date().toJSON().slice(0,10));
  const [endDate, setEndDate] = useState<string>(new Date().toJSON().slice(0,10));
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage - 1);
    console.log(page);
  };
  const handleChangeStartDate = (newValue: dayjs.Dayjs | null) => {
    setStartDate(newValue ? newValue.toISOString() : "");
  };
  const handleChangeEndDate = (newValue: dayjs.Dayjs | null) => {
    setEndDate(newValue ? newValue.toISOString() : "");
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/reports/loans-history-by-student?startDate="+(startDate.slice(0,10))+"&endDate="+endDate.slice(0,10)+"&page="+page+"&userId="+username,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth,
            },
          }
        );
        const data = await response.json();
        if (data.statusCode === 500) {
          navigate("/");
        }
        if (!response.ok) {
          throw new Error("Error to fetch History Loans");
        }
        console.log(data);
        setCareers(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        navigate("/");
        console.error(error);
      }
    };

    fetchComments();
  }, [page, startDate,endDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="appContainer">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ResponsiveDrawerStudent />
      <div className="listCareersContainer">
        <h1 className="titleContainer">HISTORY LOANS</h1>
        <div className="startDate-container">
           <DatePicker
                        label="Start Date"
                        name="startDate"
                        onChange={handleChangeStartDate}
                        sx={{
                          marginTop: 0,
                          marginBottom: 1,
                          width: "100%",
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#BAF266",
                            },
                          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "white",
                            },
                        }}
                       
            />
            <DatePicker
                        label="End Date"
                        name="endDate"
                        onChange={handleChangeEndDate}
                        sx={{
                          marginTop: 0,
                          marginBottom: 1,
                          width: "100%",
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#BAF266",
                            },
                          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "white",
                            },
                        }}
                       
            />
        </div>

          <div className="tableContainer">
            <StickyHeadTable
              columns={columns}
              rows={careers}
              page={page}
              totalPages={totalPages}
              handleChangePage={handleChangePage}
            />
          </div>

      </div>
    </div>
    </LocalizationProvider>
  );
}

export default HistoryLoans;
