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

function ReportArrearsByStudent() {
  const columns: Column[] = [
    { id: "id", label: "id", minWidth: 100, align: "center" },
    { id: "studentId", label: "User Id", minWidth: 100, align: "center" },
    { id: "bookName", label: "Book Name", minWidth: 100, align: "center" },
    { id: "isbnCode", label: "ISBN Code", minWidth: 100, align: "center" },
    { id: "paymentDate", label: "Payment Date", minWidth: 100, align: "center" },
    { id: "amount", label: "Amount", minWidth: 100, align: "center" },
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
    paymentDate: string;
    studentId: number;
  }

  const [careers, setCareers] = useState<Career[]>([]);
  const [startDate, setStartDate] = useState<string>(
    new Date().toJSON().slice(0, 10)
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toJSON().slice(0, 10)
  );
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
          "http://localhost:8080/api/v1/reports/arrears-by-student?startDate=" +
            startDate.slice(0, 10) +
            "&endDate=" +
            endDate.slice(0, 10) +
            "&userId=" +
            search +
            "&page=" +
            page,
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
          throw new Error("Error to fetch report");
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
  }, [page, startDate, endDate,search]);

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
          <h1 className="titleContainer">ARREARS BY STUDENT</h1>
          <div className="startDate-container">
            <div className="search-container">
              <InputBase
                className="search-input"
                placeholder="Search Book Name"
                inputProps={{ "aria-label": "search book name" }}
                onChange={(e) => setSearch(e.target.value)}
              />
              <IconButton
                className="search-button"
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </div>
            <DatePicker
              label="Start Date"
              name="startDate"
              onChange={handleChangeStartDate}
              sx={{
                marginTop: 0,
                marginBottom: 1,
                width: "100%",
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
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
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
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

export default ReportArrearsByStudent;
