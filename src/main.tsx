import ReactDOM from "react-dom/client";
import "./styles/index.css";
import SignIn from "./views/Login.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./views/App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/dashboard-admin" element={<App />} />
    </Routes>
  </BrowserRouter>
);
