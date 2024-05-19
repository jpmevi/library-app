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

function CareerList() {
  const columns: Column[] = [
    { id: "id", label: "id", minWidth: 100, align: "center" },
    { id: "name", label: "name", minWidth: 100, align: "center" },
  ];
  const careername = localStorage.getItem("careername");
  const auth = localStorage.getItem("auth");
  const accountNumber = localStorage.getItem("accountNumber");
  const navigate = useNavigate();
  interface Career {
    id: string;
    name: string;
  }
  const handleDelete = async (careerId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/careers/${careerId}`,
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
      setCareers(careers.filter((career) => career.id !== careerId));
      toast.success(`Career ${careerId} succesfully deleted`);
    } catch (error) {
      console.error("Error to eliminate career:", error);
      toast.error("Error  to eliminate career: " + error);
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
      onClick: (careerId: string) => navigate(`/career-update/${careerId}`), // Modificado para incluir careerId en la URL
    },
  ];
  const [careers, setCareers] = useState<Career[]>([]);
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
          "http://localhost:8080/api/v1/careers?page=" +
            page +
            "&careerName=" +
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
      <div className="listCareersContainer">
        <h1 className="titleContainer">CAREERS LIST</h1>
        <div className="search-container">
          <InputBase
            className="search-input"
            placeholder="Search CareerId"
            inputProps={{ "aria-label": "search careerName" }}
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
              rows={careers}
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

export default CareerList;
