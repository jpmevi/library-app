import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ResponsiveDrawer from "../../../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/App.css";
import { Box, Button, TextField, styled } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FileUpload() {
  const [file, setFile] = useState(null); // Estado para almacenar el archivo seleccionado
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const auth = localStorage.getItem("auth");

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
    margin: 10,
  });

  function formatErrors(errors:any) {
    return errors.map((error:any, index:any) => `${index + 1}. ${error}`).join('\n\n');
  }

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name); // Actualiza el nombre del archivo seleccionado
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!file) {
      toast.error("Por favor selecciona un archivo para subir.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Agrega el archivo a FormData

    try {
      const response = await fetch(`http://localhost:8080/api/v1/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        body: formData, // Envía FormData
      });

      const dataJson = await response.json();
      if (!response.ok) {
        toast.error(dataJson.message || "Error al subir el archivo");
      } else {
        toast.success("Archivo subido exitosamente");
        setErrors(formatErrors(dataJson.data));
      }
    } catch (error) {
      toast.error("Error al procesar la solicitud");
      console.error("Error al procesar la solicitud:", error);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <div className="appContainer">
      <ToastContainer />
      <ResponsiveDrawer />
      <Box
        style={{ display: "flex", flexDirection: "column" }}
        component="form"
        onSubmit={handleSubmit}
        className="fileUploadContainer"
      >
        <h1 className="titleContainer">CARGAR ARCHIVO</h1>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 20 }}
        >
          <Button
            sx={{ margin: 1 }}
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Select file
            <VisuallyHiddenInput
              type="file"
              onChange={handleFileChange}
              accept="*"
            />
          </Button>
          {fileName && (
            <span
              style={{ marginLeft: 20, color: "white", fontWeight: "bold" }}
            >
              {fileName}
            </span>
          )}{" "}
          {/* Muestra el nombre del archivo */}
        </div>
        <Button
          sx={{ margin: 3 }}
          type="submit"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
        <TextField
          disabled={true}
          sx={{
            maxHeight: "400px",
            height: 400,
            borderRadius: "12px",
            width: "100%",
            "& .MuiInputBase-input.Mui-disabled": {
              // Estilo para el texto del input cuando está deshabilitado
              color: "red", // Color del texto
              WebkitTextFillColor: "red", // Asegura que el texto sea blanco en navegadores Webkit
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-disabled": {
                color: "#dadada",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BAF266",
                },
              },
            },
            backgroundColor: "black",
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
          }}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
          id="outlined-multiline-static"
          label="Errors"
          multiline
          rows={16}
          value={errors.length ? errors : "Waiting for a file..."}
        />
      </Box>
    </div>
  );
}

export default FileUpload;
