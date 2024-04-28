import { Delete } from "@mui/icons-material";
import CreateIcon from "@mui/icons-material/Create";
import StickyHeadTable, { Column } from "../../components/Table";
import PaymentIcon from "@mui/icons-material/Payment";
import PaymentsIcon from "@mui/icons-material/Payments";
import ResponsiveDrawer from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/App.css";
import { createTheme } from "@mui/material";
const columns: Column[] = [
  { id: "userId", label: "ID", minWidth: 100, align: "center" },
  { id: "name", label: "Amount", minWidth: 100, align: "center" },
  { id: "careerId", label: "Old Balance", minWidth: 100, align: "center" },
  {
    id: "birthDate",
    label: "Current Balance",
    minWidth: 100,
    align: "center",
  },
  { id: "role", label: "Type", minWidth: 100, align: "center" },
];

function UserList() {
  const username = localStorage.getItem("username");
  const auth = localStorage.getItem("auth");
  const accountNumber = localStorage.getItem("accountNumber");
  const navigate = useNavigate();
  interface User {
    userId: string;
    name: string;
    careerId: number;
    birthDate: string;
    role: string;
  }
  const [history, setHistory] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = createTheme({
    palette: {
      secondary: {
        main: '#FFFFFF'
      }
    }
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth,
          },
        });
        const data = await response.json();
        if (data.statusCode === 401) {
          navigate("/login");
        }
        if (!response.ok) {
          throw new Error("Error al cargar los historiales");
        }
        console.log(data);
        setHistory(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="appContainer">
      <ResponsiveDrawer />
      <div className="tableContainer">
        <StickyHeadTable
          columns={columns}
          rows={history}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}

export default UserList;
