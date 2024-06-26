
import ResponsiveDrawer from "../../../components/Sidebar";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/App.css";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function UserEdit() {
  const auth = localStorage.getItem("auth");
  const navigate = useNavigate();
  interface User {
    userId?: string;
    name?: string;
    careerId?: number;
    birthDate?: string;
    role?: string;
    password?: string;
  }
  interface Career {
    code: string;
    name: string;
  }

  const { userId } = useParams();
  const [user, setUser] = useState<User>();
  const [career, setCareer] = useState<Career[]>([]);
  const [careerSelect, setCareerSelect] = useState<number | undefined>(0);
  const [role, setRole] = useState<string | undefined>("");
  const [formErrors, setFormErrors] = useState({
    userId: "",
    name: "",
    careerId: "",
    birthDate: "",
    role: "",
    password: "",
  });
  const theme = createTheme({
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "white", // Cambiar el color de todas las labels a blanco
            "&.Mui-focused": {
              color: "white", // Asegúrate de que la label se mantenga blanca incluso cuando el campo está en foco
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const response = await fetch(
          "http://54.196.99.149:8085/api/v1/careers?size=" + 1000,
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
          toast.error(data.message);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
        if (!response.ok) {
          throw new Error("Error al cargar las carreras");
        }
        console.log(data);
        setCareer(data.data);
      } catch (error) {
        navigate("/");
        console.error(error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://54.196.99.149:8085/api/v1/users/${userId}`,
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
          toast.error(data.message);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
        if (!response.ok) {
          toast.error(data.message);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
        console.log(data);
        setUser(data.data);
        console.log(user?.careerId);
        setCareerSelect(user?.careerId);
        setRole(user?.role);
      } catch (error) {
        toast.error("Error al procesar la solicitud:");
        console.error("Error al procesar la solicitud:", error);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };
    fetchUser();
    fetchCareer();
  }, []);

  useEffect(() => {
    if (user) {
      setCareerSelect(user?.careerId);
      setRole(user?.role);
    }
  }, [user]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeCareer = (event: any) => {
    setUser((prev) => ({ ...prev, ["careerId"]: event.target.value }));
    setCareerSelect(event.target.value);
  };
  const handleChangeRole = (event: any) => {
    setUser((prev) => ({ ...prev, ["role"]: event.target.value }));
    setRole(event.target.value);
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Si la validación es exitosa, procede con la petición fetch u otra lógica
    try {
      const response = await fetch(
        `http://54.196.99.149:8085/api/v1/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify(user),
        }
      );
      console.log(response);
      const dataJson = await response.json();
      console.log(dataJson);
      if (!response.ok) {
        if (dataJson.httpCode == 400 && dataJson.errors) {
          Object.entries(dataJson.errors).forEach(([field, message]) => {
            console.log(`${field}: ${message}`);
            toast.error(`${field}: ${message}`);
          });
        } else if (dataJson.httpCode != 200) {
          toast.error(dataJson.message);
        }
      } else {
        toast.success("usuario actualizado exitosamente");
        setTimeout(() => {
          navigate("/user-list");
        }, 2000);
      }
    } catch (error) {
      toast.error("Error al procesar la solicitud:");
      console.error("Error al procesar la solicitud:", error);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  const validateForm = () => {
    let errors: any = {};
    let formIsValid = true;

    if (!user?.userId) {
      formIsValid = false;
      errors["userId"] = "User ID is required.";
    }

    if (!user?.name) {
      formIsValid = false;
      errors["name"] = "Name is required.";
    }

    if (!careerSelect) {
      formIsValid = false;
      errors["careerId"] = "Career is required.";
    }

    if (!role) {
      formIsValid = false;
      errors["role"] = "Role is required.";
    }

    setFormErrors(errors);
    return formIsValid;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
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
          <div className="listUsersEditContainer">
            <h1 className="titleContainer">UPDATE USER</h1>
            <div className="login2">
              <Box
                sx={{
                  background: "#0D0D0D",
                  marginTop: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: 16,
                  color: "white",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Container component="main" maxWidth="xs">
                  <Box
                    sx={{
                      width: "100%",
                      marginTop: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{ margin: 0 }}
                      component="h1"
                      variant="h5"
                      fontWeight="bold"
                    >
                      CUNOC LIBRARY
                    </Typography>

                    <Avatar sx={{ m: 1, bgcolor: "#BAF266" }}>
                      <EditIcon sx={{ color: "black" }} />
                    </Avatar>
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      noValidate
                      sx={{ mt: 1 }}
                    >
                       <InputLabel
                        sx={{ color: "white" }}
                        id="userId"
                      >
                        User ID
                      </InputLabel>
                      <TextField
                        disabled={true}
                        error={!!formErrors.userId}
                        helperText={formErrors.userId}
                        margin="none"
                        required
                        fullWidth
                        id="userId"
                        name="userId"
                        autoComplete="userId"
                        autoFocus
                        value={user?.userId}
                        onChange={handleChange}
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "white",
                          },
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-disabled": {
                              color: "#dadada",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#BAF266",
                              },
                            },
                          },
                          "& .MuiInputLabel-root": {
                            "&.Mui-disabled": {
                              color: "white !important",
                            },
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#BAF266",
                            },
                          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "white",
                            },
                        }}
                        InputProps={{
                          style: {
                            color: "white !important",
                            borderColor: "white",
                          }, // Direct inline styles
                          disableUnderline: true, // Optional: disable the underline
                        }}
                        InputLabelProps={{
                          style: { color: "white" },
                        }}
                      />
                      <InputLabel
                        sx={{ color: "white" }}
                        id="name"
                      >
                        Name
                      </InputLabel>
                      <TextField
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        margin="none"
                        required
                        fullWidth
                        name="name"
                        id="name"
                        autoComplete="name"
                        value={user?.name}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#BAF266",
                            },
                          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "white",
                            },
                        }}
                        InputProps={{ style: { color: "white" } }}
                        InputLabelProps={{ style: { color: "white" } }}
                      />
                      <InputLabel
                        sx={{ color: "white" }}
                        id="demo-select-small-label"
                      >
                        Career
                      </InputLabel>
                      <Select
                        error={!!formErrors.careerId}
                        onChange={handleChangeCareer}
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={careerSelect}
                        label="Career"
                        sx={{
                          width: "100%",
                          color: "white", // Esto asegura que el texto seleccionado sea blanco
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#BAF266",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          ".MuiOutlinedInput-input": {
                            color: "white", // Asegura que el input tiene el color correcto
                          },
                          ".MuiSvgIcon-root": {
                            // Cambia el color del ícono desplegable a blanco
                            color: "white",
                          },
                        }}
                      >
                        {career.map((careerItem) => (
                          <MenuItem value={careerItem.code}>
                            {careerItem.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <DatePicker
                        label="Birth Date"
                        name="birthDate"
                        onChange={handleChange}
                        value={dayjs(user?.birthDate)}
                        sx={{
                          marginTop: 2,
                          marginBottom: 1,
                          width: "100%",
                          "& .MuiInputBase-input": {
                            color: "white",
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "white", // Make border color white
                            },
                          ".MuiSvgIcon-root": {
                            // Cambia el color del ícono desplegable a blanco
                            color: "white",
                          },
                        }}
                      />
                      <InputLabel
                        sx={{ color: "white" }}
                        id="demo-select-small-label"
                      >
                        Role
                      </InputLabel>
                      <Select
                        error={!!formErrors.role}
                        onChange={handleChangeRole}
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={role}
                        label="Role"
                        sx={{
                          width: "100%",
                          color: "white", // Esto asegura que el texto seleccionado sea blanco
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#BAF266",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          ".MuiOutlinedInput-input": {
                            color: "white", // Asegura que el input tiene el color correcto
                          },
                          ".MuiSvgIcon-root": {
                            // Cambia el color del ícono desplegable a blanco
                            color: "white",
                          },
                        }}
                      >
                        <MenuItem value={"ADMINISTRATOR"}>
                          ADMINISTRATOR
                        </MenuItem>
                        <MenuItem value={"STUDENT"}>STUDENT</MenuItem>
                      </Select>
                      <TextField
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="password"
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#BAF266",
                            },
                          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "white",
                            },
                        }}
                        InputProps={{ style: { color: "white" } }}
                        InputLabelProps={{ style: { color: "white" } }}
                      />
                      <Button
                        className="button"
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 2,
                          color: "black",
                          backgroundColor: "#BAF266",
                          "&:hover": {
                            backgroundColor: "white",
                          },
                        }}
                      >
                        Update
                      </Button>
                    </Box>
                  </Box>
                </Container>
              </Box>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default UserEdit;
