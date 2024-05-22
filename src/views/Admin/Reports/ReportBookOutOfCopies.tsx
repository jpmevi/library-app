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

function ReportBookOutOfCopies() {
  const columns: Column[] = [
    { id: "id", label: "id", minWidth: 100, align: "center" },
    { id: "author", label: "Author", minWidth: 100, align: "center" },
    { id: "isbnCode", label: "Isbn Code", minWidth: 100, align: "center" },
    { id: "bookName", label: "Book Name", minWidth: 100, align: "center" },
  ];
  const careername = localStorage.getItem("careername");
  const auth = localStorage.getItem("auth");
  const accountNumber = localStorage.getItem("accountNumber");
  const navigate = useNavigate();
  interface Career {
    id: string;
    author: any;
    bookName: any;
    isbnCode: any;
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
    setDate(newValue && newValue.isValid() ? newValue.toISOString() : "");
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          "http://54.196.99.149:8085/api/v1/reports/books-out-of-copies"+"?page="+page,
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
          throw new Error("Error to fetch report");
        }
        if(data.data.length> 0){
          console.log(data);
          setCareers(data.data);
          setTotalPages(data.totalPages);
        }else{
          setCareers([]);
        }
       
      } catch (error) {
        navigate("/");
        console.error(error);
      }
    };

    fetchComments();
  }, [page]);

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
        <h1 className="titleContainer">BOOKS WITHOUT COPIES</h1>
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

export default ReportBookOutOfCopies;
