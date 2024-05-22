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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import LoanCreate from "./LoanCreate";
import dayjs from "dayjs";

function ReturnBook() {
  const auth = localStorage.getItem("auth");
  const navigate = useNavigate();
  interface Search {
    isbnCode?: string;
  }

  interface Return {
    actualDate?: string;
    studentId?: string;
    isbnCode?: string;
  }
  const [returnData, setReturnData] = useState<Return>();
  const [books, setBooks] = useState();
  const [amount, setAmount] = useState<number>();
  const [isArrear, setIsArrear] = useState<boolean>(false);
  const [isbnCode, setIsbnCode] = useState<Search>();
  const [isbnCodes, setIsbnCodes] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState({
    isbnCode: "",
    studentId: "",
    actualDate: "",
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
    setReturnData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeDate = (newValue: dayjs.Dayjs | null) => {
    setReturnData((prev) => ({
      ...prev,
      actualDate: newValue && newValue.isValid() ? newValue.toISOString() : "",
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if(isArrear){
      try {
            const response2 = await fetch(
              "http://54.196.99.149:8085/api/v1/loans/payAndReturn/"+amount,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${auth}`,
                },
                body: JSON.stringify(returnData),
              }
            );
            const dataJsonPayment = await response2.json();
            if (!response2.ok) {
              toast.error(dataJsonPayment.message);
            } else {
              toast.success("Book returned successfully");
              setTimeout(() => {
                navigate("/dashboard-admin");
              }, 2000);
            }
      } catch (error) {
        toast.error("Error processing the request");
        console.error("Error processing the request:", error);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }else{
      if (!validateForm()) {
        toast.error("Please fill in all required fields.");
        return;
      }
  
      try {
        const response = await fetch(
          "http://54.196.99.149:8085/api/v1/loans/return",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth}`,
            },
            body: JSON.stringify(returnData),
          }
        );
        const dataJson = await response.json();
        if (!response.ok) {
          toast.error(dataJson.message);
        } else {
          setBooks(dataJson.data);
          if (dataJson.data.totalToPay > 1) {
            toast.error("You have to pay the arrear");
            setIsArrear(true);
            setAmount(dataJson.data.totalToPay);
          } else {
            const response2 = await fetch(
              "http://54.196.99.149:8085/api/v1/loans/payAndReturn/"+dataJson.data.totalToPay,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${auth}`,
                },
                body: JSON.stringify(returnData),
              }
            );
            const dataJsonPayment = await response2.json();
            if (!response2.ok) {
              toast.error(dataJsonPayment.message);
            } else {
              toast.success("Book returned successfully");
              setTimeout(() => {
                navigate("/dashboard-admin");
              }, 2000);
            }
          }
          
          //navigate("loan-create");
        }
      } catch (error) {
        toast.error("Error processing the request");
        console.error("Error processing the request:", error);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
    
  };

  const validateForm = () => {
    let errors: any = {};
    let formIsValid = true;

    if (!returnData?.isbnCode) {
      formIsValid = false;
      errors["isbnCode"] = "ISBN Code is required.";
    }

    if (!returnData?.actualDate) {
      formIsValid = false;
      errors["actualDate"] = "Actual Date is required.";
    }

    if (!returnData?.studentId) {
      formIsValid = false;
      errors["studentId"] = "Student Id is required.";
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
          {isArrear ? (
            <div className="listCareersEditContainer">
            <h1 className="titleContainer">RETURN BOOK</h1>
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
                        Amount
                      </InputLabel>
                      <TextField
                        error={!!formErrors.isbnCode}
                        helperText={formErrors.isbnCode}
                        margin="none"
                        required
                        fullWidth
                        type="number"
                        name="amount"
                        id="amount"
                        autoComplete="amount"
                        value={amount ? amount : 0}
                        onChange={(e)=> setAmount(Number(e.target.value))}
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
                        Pay And Return
                      </Button>
                    </Box>
                  </Box>
                </Container>
              </Box>
            </div>
          </div>
          ) : (
            <div className="listCareersEditContainer">
              <h1 className="titleContainer">RETURN BOOK</h1>
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
                          autoComplete="isbnCode"
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
                        <InputLabel sx={{ color: "white" }} id="studentId">
                          Student ID
                        </InputLabel>
                        <TextField
                          error={!!formErrors.studentId}
                          helperText={formErrors.studentId}
                          margin="none"
                          required
                          fullWidth
                          name="studentId"
                          id="studentId"
                          autoComplete="studentId"
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
                        <DatePicker
                          label="Actual Date"
                          name="actualDate"
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
                      </Box>
                    </Box>
                  </Container>
                </Box>
              </div>
            </div>
          )}
        </div>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default ReturnBook;
