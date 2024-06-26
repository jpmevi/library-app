import "../styles/index.css";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MenuBookSharpIcon from "@mui/icons-material/MenuBookSharp";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="white" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="">
        Cunoc Library
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignIn() {
  localStorage.setItem("auth", "");
  const [loginError, setLoginError] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const userId = data.get("userId") as string;
    try {
      const response = await fetch("http://54.196.99.149:8085/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          password: data.get("password"),
        }),
      });
      const dataJson = await response.json();
      console.log(dataJson);
      if (response.ok) {
        localStorage.setItem("auth", dataJson.token);
        localStorage.setItem("username", userId);
        localStorage.setItem("role", dataJson.role);
        setLoginError(false);
        if (dataJson.role === "ROLE_ADMINISTRATOR") {
          navigate("/dashboard-admin");
        } else {
          navigate("/dashboard-student");
        }
        // La solicitud fue exitosa, puedes redirigir a la página deseada
      } else {
        if (dataJson.httpCode == 400 && dataJson.errors) {
          Object.entries(dataJson.errors).forEach(([field, message]) => {
            console.log(`${field}: ${message}`);
            toast.error(`${field}: ${message}`);
          });
        } else if (dataJson.httpCode != 200) {
          toast.error(dataJson.message);
        }
        // La solicitud no fue exitosa, maneja el error o muestra un mensaje
      }
    } catch (error) {
      setLoginError(true);
      console.error("Error al procesar la solicitud:", error);
    }
  };

  return (
    <div className="login">
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
      <Box
        sx={{
          background: "#0D0D0D",
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 16,
          color: "white",
        }}
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5" fontWeight="bold">
              CUNOC LIBRARY
            </Typography>

            <Avatar sx={{ m: 1, bgcolor: "#BAF266" }}>
              <MenuBookSharpIcon sx={{ color: "black" }} />
            </Avatar>
            <Typography component="h1" variant="h5">
              LOG IN
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="userId"
                label="User ID"
                name="userId"
                autoComplete="userId"
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#BAF266",
                  },
                  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "white",
                    },
                }}
                InputProps={{ style: { color: "white", borderColor: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
                sx={{
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
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
              {loginError && (
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "red",
                    justifyContent: "center",
                    padding: "10px",
                    borderRadius: "16px"
                  }}
                >
                  User and Password are required
                </div>
              )}
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
                Log In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    href="#"
                    variant="body2"
                    sx={{
                      color: "#BAF266",
                      textDecorationColor: "#BAF266",
                      "&:hover": {
                        textDecorationColor: "white",
                      },
                    }}
                  >
                    Forgot pin?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    sx={{
                      color: "#BAF266",
                      textDecorationColor: "#BAF266",
                      "&:hover": {
                        textDecorationColor: "white",
                      },
                    }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </Box>
    </div>
  );
}
