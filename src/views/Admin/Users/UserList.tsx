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
const columns: Column[] = [
  { id: "userId", label: "userId", minWidth: 100, align: "center" },
  { id: "name", label: "name", minWidth: 100, align: "center" },
  { id: "careerId", label: "careerId", minWidth: 100, align: "center" },
  {
    id: "birthDate",
    label: "birthDate",
    minWidth: 150,
    align: "center",
  },
  { id: "role", label: "role", minWidth: 100, align: "center" },
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
  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }
      const data = await response.json();
      // Filtrar el usuario eliminado del estado local
      setHistory(history.filter((user) => user.userId !== userId));
      toast.success(`Usuario ${userId} eliminado correctamente`);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      toast.error("Error al eliminar el usuario: " + error);
      navigate("/");
    }
  };

  const actions = [
    {
      icon: <DeleteIcon />,
      onClick: handleDelete, // Referencia directa a la función
    },
    {
      icon: <EditIcon />,
      onClick: (userId: string) => navigate(`/users-edit/${userId}`), // Modificado para incluir userId en la URL
    },
  ];
  const [history, setHistory] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage - 1);
    console.log(page);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/users?page=" +
            page +
            "&userId=" +
            search,
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
          throw new Error("Error al cargar los usuarios");
        }
        console.log(data);
        setHistory(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        navigate("/");
        console.error(error);
      }
    };

    fetchComments();
  }, [page, search]);

  return (
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
      <div className="listUsersContainer">
        <h1 className="titleContainer">LISTADO DE USUARIOS</h1>
        <div className="search-container">
          <InputBase
            className="search-input"
            placeholder="Search UserId"
            inputProps={{ "aria-label": "search userId" }}
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

          <div className="tableContainer">
            <StickyHeadTable
              columns={columns}
              rows={history}
              page={page}
              totalPages={totalPages}
              handleChangePage={handleChangePage}
              actions={actions}
            />
          </div>

      </div>
    </div>
  );
}

export default UserList;
