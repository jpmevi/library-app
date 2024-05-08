import ReactDOM from "react-dom/client";
import "./styles/index.css";
import SignIn from "./views/Login.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./views/App.tsx";
import UserList from "./views/Admin/Users/UserList.tsx";
import UserEdit from "./views/Admin/Users/UserEdit.tsx";
import UserCreate from "./views/Admin/Users/UserCreate.tsx";
import FileUpload from "./views/Admin/FileUpload/FileUpload.tsx";
import BookCreate from "./views/Admin/Books/BookCreate.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/dashboard-admin" element={<App />} />
      <Route path="/user-list" element={<UserList />} />
      <Route path="/user-create" element={<UserCreate />} />
      <Route path="/users-edit/:userId" element={<UserEdit />} />
      <Route path="/file-upload" element={<FileUpload />} />
      <Route path="../book-create" element={<BookCreate />} />
    </Routes>
  </BrowserRouter>
);
