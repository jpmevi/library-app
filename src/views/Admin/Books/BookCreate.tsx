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

function BookCreate() {
  const auth = localStorage.getItem("auth");
  const navigate = useNavigate();
  interface Book {
    isbnCode?: string;
    author?: number;
    title?: string;
    publicationDate?: string;
    publisher?: string;
    availableCopies?: number;
    timesBorrowed?:number,
    imgUrl?: string,
  };
  interface Career {
    id: number;
    name: string;
  }

  const [book, setBook] = useState<Book>();
  const [career, setCareer] = useState<Career[]>([]);
  const [image, setImage] = useState<string | undefined>("");
  const [role, setRole] = useState<string | undefined>("");
  const [formErrors, setFormErrors] = useState({
    isbnCode: "",
    author: "",
    title: "",
    publicationDate: "",
    publisher: "",
    availableCopies: "",
    imgUrl: ""
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
    
  }, []);

  const handleChangeDate = (newValue: dayjs.Dayjs | null) => {
    setBook((prev) => ({
      ...prev,
      publicationDate: newValue ? newValue.toISOString() : "",
    }));
  };
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeImage = (event: any) => {
    const { value } = event.target;
    setBook((prev) => ({
      ...prev,
      imgUrl: value,
    }));
    setImage(value);
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
        `http://54.196.99.149:8085/api/v1/books`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify(book),
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
        toast.success("libro creado exitosamente");
        setTimeout(() => {
          navigate("/dashboard-admin");
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

    if (!book?.isbnCode) {
      formIsValid = false;
      errors["isbnCode"] = "ISBN Code is required.";
    }

    if (!book?.title) {
      formIsValid = false;
      errors["title"] = "Title is required.";
    }

    if (!book?.author) {
      formIsValid = false;
      errors["author"] = "Author is required.";
    }

    if (!book?.availableCopies) {
      formIsValid = false;
      errors["availableCopies"] = "Available Copies is required.";
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
          <div className="bookPageContainer">
            <h1 className="titleContainer">CREATE BOOK</h1>
            <div className="createBookContainer">
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
                <div className="createBookContainer">
                  <div className="imageBookContainer">
                    <img
                      className="imageBookContainerImage"
                      alt={`image`}
                      src={
                        image
                        ? 
                        image
                        :
                        "https://islandpress.org/files/default_book_cover_2015.jpg"
                      }
                    />
                  </div>
                  <Box
                    sx={{
                      width: "100%",
                      marginTop: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      maxWidth: "1000px",
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
                      sx={{ mt: 1, width: "100%", maxWidth: "100%" }}
                    >
                      <TextField
                        label="ISBN Code"
                        error={!!formErrors.isbnCode}
                        helperText={formErrors.isbnCode}
                        margin="normal"
                        required
                        fullWidth
                        id="isbnCode"
                        name="isbnCode"
                        autoComplete="isbnCode"
                        autoFocus
                        onChange={handleChange}
                        sx={{
                          marginTop: 0,
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
                      <TextField
                        error={!!formErrors.author}
                        helperText={formErrors.author}
                        margin="normal"
                        required
                        fullWidth
                        label="Author"
                        name="author"
                        id="author"
                        autoComplete="author"
                        onChange={handleChange}
                        sx={{
                          marginTop: 0,
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
                       <TextField
                        label="Title"
                        error={!!formErrors.title}
                        helperText={formErrors.title}
                        margin="normal"
                        required
                        fullWidth
                        name="title"
                        id="title"
                        autoComplete="title"
                        onChange={handleChange}
                        sx={{
                          marginTop: 0,
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
                      <DatePicker
                        label="Publication Date"
                        name="publicationDate"
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
                      <TextField
                        error={!!formErrors.publisher}
                        helperText={formErrors.publisher}
                        margin="normal"
                        fullWidth
                        name="publisher"
                        label="Publisher"
                        type="publisher"
                        id="publisher"
                        autoComplete="publisher"
                        onChange={handleChange}
                        sx={{
                          marginTop: 0,
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
                      <TextField
                        error={!!formErrors.availableCopies}
                        helperText={formErrors.availableCopies}
                        margin="normal"
                        fullWidth
                        name="availableCopies"
                        label="Available Copies"
                        type="number"
                        id="availableCopies"
                        autoComplete="availableCopies"
                        onChange={handleChange}
                        sx={{
                          marginTop: 0,
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
                      <TextField
                        margin="normal"
                        fullWidth
                        name="imgUrl"
                        label="Image Url"
                        id="imgUrl"
                        autoComplete="imgUrl"
                        onChange={handleChangeImage}
                        sx={{
                          marginTop: 0,
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
                        Create
                      </Button>
                    </Box>
                  </Box>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default BookCreate;
