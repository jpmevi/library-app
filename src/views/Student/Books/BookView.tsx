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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { red } from "@mui/material/colors";
import ResponsiveDrawerStudent from "../../../components/SidebarStudent";

function BookView() {
  const auth = localStorage.getItem("auth");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  interface Book {
    isbnCode?: string;
    author?: number;
    title?: string;
    publicationDate?: string;
    publisher?: string;
    availableCopies?: number;
    timesBorrowed?: number;
    imgSrc?: string;
  }
  interface Career {
    id: number;
    name: string;
  }

  const { bookId } = useParams();
  const [book, setBook] = useState<Book>();
  const [image, setImage] = useState<string | undefined>("");
  const [formErrors, setFormErrors] = useState({
    isbnCode: "",
    author: "",
    title: "",
    publicationDate: "",
    publisher: "",
    availableCopies: "",
    imgSrc: "",
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
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `http://54.196.99.149:8085/api/v1/books/${bookId}`,
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
        setBook(data.data);
      } catch (error) {
        toast.error("Error al procesar la solicitud:");
        console.error("Error al procesar la solicitud:", error);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };
    fetchBook();
  }, []);

  const handleChangeDate = (newValue: dayjs.Dayjs | null) => {
    setBook((prev) => ({
      ...prev,
      publicationDate: newValue && newValue.isValid() ? newValue.toISOString() : "",
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
      imgSrc: value,
    }));
    setImage(value);
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // Si la validación es exitosa, procede con la petición fetch u otra lógica
    try {
      const response = await fetch(
        `http://54.196.99.149:8085/api/v1/reservations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify({userId: username, bookId: bookId}),
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
        toast.success("Reservation successfuly created");
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

    if (!book?.publicationDate) {
      formIsValid = false;
      errors["publicationDate"] = "Publication Date is required.";
    }

    if (!book?.availableCopies) {
      formIsValid = false;
      errors["availableCopies"] = "Available Copies is required.";
    }

    if (!book?.publisher) {
      formIsValid = false;
      errors["publisher"] = "Publisher is required.";
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
          <ResponsiveDrawerStudent />
          <div className="bookPageContainer">
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
                          ? image
                          : "https://islandpress.org/files/default_book_cover_2015.jpg"
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
                      VIEW BOOK
                    </Typography>
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      noValidate
                      sx={{ mt: 1, width: "100%", maxWidth: "100%" }}
                    >
                      <InputLabel sx={{ color: "white" }} id="isbnCode">
                        ISBN Code
                      </InputLabel>
                      <TextField
                        disabled= {true}
                        error={!!formErrors.isbnCode}
                        helperText={formErrors.isbnCode}
                        margin="none"
                        required
                        fullWidth
                        id="isbnCode"
                        name="isbnCode"
                        autoComplete="isbnCode"
                        onChange={handleChange}
                        value={book?.isbnCode}
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
                      <InputLabel sx={{ color: "white" }} id="author">
                        Author
                      </InputLabel>
                      <TextField
                        disabled = {true}
                        error={!!formErrors.author}
                        helperText={formErrors.author}
                        margin="none"
                        required
                        fullWidth
                        name="author"
                        id="author"
                        value={book?.author}
                        autoComplete="author"
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
                      <InputLabel sx={{ color: "white" }} id="title">
                        Title
                      </InputLabel>
                      <TextField
                      disabled={true}
                        value={book?.title}
                        error={!!formErrors.title}
                        helperText={formErrors.title}
                        margin="none"
                        required
                        fullWidth
                        name="title"
                        id="title"
                        autoComplete="title"
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
                      <DatePicker
                        disabled={true}
                        value={dayjs(book?.publicationDate)}
                        label="Publication Date"
                        name="publicationDate"
                        onChange={handleChangeDate}
                        sx={{
                          marginTop: 1,
                          marginBottom: 0,
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
                      />
                      <InputLabel sx={{ color: "white" }} id="publisher">
                        Publisher
                      </InputLabel>
                      <TextField
                      disabled={true}
                        value={book?.publisher}
                        error={!!formErrors.publisher}
                        helperText={formErrors.publisher}
                        margin="none"
                        fullWidth
                        name="publisher"
                        type="publisher"
                        id="publisher"
                        autoComplete="publisher"
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
                      <InputLabel sx={{ color: "white" }} id="availableCopies">
                        Available Copies
                      </InputLabel>
                      <TextField
                      disabled={true}
                        value={book?.availableCopies}
                        error={!!formErrors.availableCopies}
                        helperText={formErrors.availableCopies}
                        margin="none"
                        fullWidth
                        name="availableCopies"
                        type="number"
                        id="availableCopies"
                        autoComplete="availableCopies"
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
                      <InputLabel sx={{ color: "white" }} id="imgSrc">
                        Img Url
                      </InputLabel>
                      <TextField
                        disabled={true}
                        value={book?.imgSrc}
                        margin="none"
                        fullWidth
                        name="imgSrc"
                        id="imgSrc"
                        autoComplete="imgSrc"
                        onChange={handleChangeImage}
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
                        Create Reservation
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

export default BookView;
