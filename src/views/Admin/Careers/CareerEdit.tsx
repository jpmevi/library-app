
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

function CareerEdit() {
  const auth = localStorage.getItem("auth");
  const navigate = useNavigate();
  interface Career {
    id?: number;
    name?: string;
   
  }

  const { careerId } = useParams();
  const [career, setCareer] = useState<Career>();
  const [formErrors, setFormErrors] = useState({
    id: "",
    name: ""
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
          `http://localhost:8080/api/v1/careers/${careerId}`,
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
        setCareer(data.data);
      } catch (error) {
        toast.error("Error al procesar la solicitud:");
        console.error("Error al procesar la solicitud:", error);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };
    fetchCareer();
  }, []);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setCareer((prev) => ({ ...prev, [name]: value }));
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
        `http://localhost:8080/api/v1/careers/${careerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify(career),
        }
      );
      console.log(response);
      const dataJson = await response.json();
      console.log(dataJson);
      if (!response.ok) {
        if (dataJson.httpCode == 400 && dataJson.errors) {
          Object.entries(dataJson.errors).forEach(([field, message]) => {
            console.log(`${field}: ${message}`);
            toast.error(`${message}`);
          });
        } else if (dataJson.httpCode != 200) {
          toast.error(dataJson.message);
        }
      } else {
        toast.success("career successfully updated");
        setTimeout(() => {
          navigate("/career-list");
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

    if (!career?.name) {
      formIsValid = false;
      errors["name"] = "Name is required.";
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
          <div className="listCareersEditContainer">
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
                        value={career?.name}
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

export default CareerEdit;
