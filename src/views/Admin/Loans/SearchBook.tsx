import ResponsiveDrawer from "../../../components/Sidebar";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import "../../../styles/App.css";
import {
  Avatar,
  Box,
  Button,
  Container,
  InputLabel,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import LoanCreate from "./LoanCreate";

function SearchBook() {
  const auth = localStorage.getItem("auth");
  const navigate = useNavigate();
  interface Search {
    isbnCode?: string;
  }

  const [books, setBooks] = useState();
  const [isLoanOk, setIsLoanOk] = useState<boolean>(false);
  const [isbnCode, setIsbnCode] = useState<Search>();
  const [isbnCodes, setIsbnCodes] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState({
    isbnCode: "",
  });

  const theme = createTheme({
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "white",
            "&.Mui-focused": {
              color: "white",
            },
          },
        },
      },
    },
  });

  useEffect(() => {}, []);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setIsbnCode((prev) => ({ ...prev, [name]: value }));
  };

  const addBookToArray = () => {
    if (isbnCode?.isbnCode && isbnCodes.length < 3) {
      setIsbnCodes((prev) => [...prev, isbnCode.isbnCode as string]);
        setIsbnCode({ isbnCode: "" });
    } else if (isbnCodes.length >= 3) {
      toast.error("You can only add up to 3 books.");
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (isbnCodes.length === 0) {
      toast.error("Please add at least one book.");
      return;
    }

    try {
      const response = await fetch("http://54.196.99.149:8085/api/v1/books/isbnCodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
        body: JSON.stringify({ isbnCodes }),
      });
      const dataJson = await response.json();
      if (!response.ok) {
        toast.error(dataJson.message);
      } else {
        setBooks(dataJson.data);
        setIsLoanOk(true);
        //navigate("loan-create");
      }
    } catch (error) {
      toast.error("Error processing the request");
      console.error("Error processing the request:", error);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  const validateForm = () => {
    let errors: any = {};
    let formIsValid = true;

    if (!isbnCode?.isbnCode) {
      formIsValid = false;
      errors["isbnCode"] = "ISBN Code is required.";
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
          {isLoanOk ? (<LoanCreate books={books} ></LoanCreate>) : (<div className="listCareersEditContainer">
            <h1 className="titleContainer">SEARCH BOOK</h1>
            <div className="login2">
              <Box
                sx={{
                  background: "#0D0D0D",
                  marginTop: 4,
                  padding: 4,
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
                      padding: 4,
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
                      <InputLabel sx={{ color: "white" }} id="isbnCode">
                        ISBN Code
                      </InputLabel>
                      <TextField
                        error={!!formErrors.isbnCode}
                        helperText={formErrors.isbnCode}
                        margin="none"
                        required
                        fullWidth
                        name="isbnCode"
                        id="isbnCode"
                        value={isbnCode?.isbnCode || ""}
                        autoComplete="isbnCode"
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#BAF266",
                          },
                          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                        }}
                        InputProps={{ style: { color: "white" } }}
                        InputLabelProps={{ style: { color: "white" } }}
                      />
                      <Button
                        className="button"
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{
                          padding: 4,
                          mt: 3,
                          mb: 2,
                          color: "black",
                          marginBottom: 4,
                          backgroundColor: "#BAF266",
                          "&:hover": {
                            backgroundColor: "white",
                          },
                        }}
                        onClick={addBookToArray}
                      >
                        Add Book
                      </Button>
                      <Button
                        className="button"
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          padding: 4,
                          mt: 3,
                          mb: 2,
                          color: "black",
                          backgroundColor: "#BAF266",
                          "&:hover": {
                            backgroundColor: "white",
                          },
                        }}
                      >
                        Submit
                      </Button>
                      <div>
                        <Typography sx={{ color: "white", marginTop: 2 }}>
                          Books to loan:
                        </Typography>
                        <ul>
                          {isbnCodes.map((code, index) => (
                            <li key={index} style={{ color: "white" }}>
                              {code}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Box>
                  </Box>
                </Container>
              </Box>
            </div>
          </div>)}
          
        </div>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default SearchBook;
