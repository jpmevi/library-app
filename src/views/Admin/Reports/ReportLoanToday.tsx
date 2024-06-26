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

function ReportLoanToday() {
  const columns: Column[] = [
    { id: "id", label: "id", minWidth: 100, align: "center" },
    { id: "studentId", label: "User Id", minWidth: 100, align: "center" },
    { id: "isbnCode", label: "Isbn Code", minWidth: 100, align: "center" },
    { id: "bookName", label: "Book Name", minWidth: 100, align: "center" },
  ];
  const careername = localStorage.getItem("careername");
  const auth = localStorage.getItem("auth");
  const accountNumber = localStorage.getItem("accountNumber");
  const navigate = useNavigate();
  interface Career {
    id: string;
    book: any;
    user: any;
  }

  const [careers, setCareers] = useState<Career[]>([]);
  const [date, setDate] = useState<string>(new Date().toJSON().slice(0,10));
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage - 1);
    console.log(page);
  };
  const handleChangeDate = (newValue: dayjs.Dayjs | null) => {
    setDate(newValue ? newValue.toISOString() : "");
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          "http://54.196.99.149:8085/api/v1/reports/loans-due-today?date="+(date.slice(0,10))+"&page="+page,
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
          navigate("/login");
        }
        if (!response.ok) {
          throw new Error("Error to fetch careers");
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
  }, [page, date]);

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
      <ResponsiveDrawer />
      <div className="listCareersContainer">
        <h1 className="titleContainer">LOANS TODAY</h1>
        <div className="date-container">
           <DatePicker
                        label="Loan Date"
                        name="loanDate"
                        onChange={handleChangeDate}
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

export default ReportLoanToday;
