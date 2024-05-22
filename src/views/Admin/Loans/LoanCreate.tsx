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

function LoanCreate(books: any) {
  console.log(books.books);
  const auth = localStorage.getItem("auth");
  const navigate = useNavigate();
  interface Loan {
    loanDate?: string;
    studentId?: string;
    bookIds?: any;
  }

  const [loan, setLoan] = useState<Loan>();
  const [formErrors, setFormErrors] = useState({
    name: "",
    studentId: "",
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
    setLoan((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeDate = (newValue: dayjs.Dayjs | null) => {
    setLoan((prev) => ({
      ...prev,
      loanDate: newValue && newValue.isValid() ? newValue.toISOString() : "",
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const updatedLoan = {
      ...loan,
      bookIds: books.books.map((book: any) => book.id),
    };
    // Si la validación es exitosa, procede con la petición fetch u otra lógica
    try {
      const response = await fetch(
        `http://54.196.99.149:8085/api/v1/loans/lend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify(updatedLoan),
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
        dataJson.data.map((data: any) => {
          if (data.success === true) {
            toast.success(data.isbnCode + ": " + data.message);
          } else {
            toast.error(data.isbnCode + ": " + data.message);
          }
        });
        setTimeout(() => {
          navigate("/dashboard-admin");
        }, 5000);
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

    if (!loan?.studentId) {
      formIsValid = false;
      errors["studentId"] = "User Id is required.";
    }

    if (!loan?.loanDate) {
      formIsValid = false;
      errors["loanDate"] = "Loan Date is required.";
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
          <div className="listCareersEditContainer">
            <h1 className="titleContainer">CREATE LOAN</h1>
            <div className="login2">
              <Box
                sx={{
                  background: "#0D0D0D",
                  marginTop: 4,
                  paddding: 4,
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
                      paddding: 4,
                      width: "100%",
                      marginTop: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
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
                      <div>
                        <Typography sx={{ color: "white", marginTop: 2 }}>
                          Books to loan:
                        </Typography>
                        <ul>
                          {books.books.map((book: any, index: any) => (
                            <li key={index} style={{ color: "white" }}>
                              {book.isbnCode}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <InputLabel sx={{ color: "white" }} id="studentId">
                        User ID
                      </InputLabel>
                      <TextField
                        error={!!formErrors.studentId}
                        helperText={formErrors.studentId}
                        margin="normal"
                        required
                        fullWidth
                        id="studentId"
                        name="studentId"
                        autoComplete="studentId"
                        autoFocus
                        onChange={handleChange}
                        sx={{
                          marginTop: 0,
                          marginBottom: 2,
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
                        label="Loan Date"
                        name="loanDate"
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
                      <Button
                        className="button"
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          paddding: 4,
                          mt: 3,
                          mb: 2,
                          color: "black",
                          marginBottom: 4,
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
                </Container>
              </Box>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default LoanCreate;
