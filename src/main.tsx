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
import BookEdit from "./views/Admin/Books/BookEdit.tsx";
import CareerList from "./views/Admin/Careers/CareerList.tsx";
import CareerEdit from "./views/Admin/Careers/CareerEdit.tsx";
import CareerCreate from "./views/Admin/Careers/CareerCreate.tsx";
import SearchBook from "./views/Admin/Loans/SearchBook.tsx";
import LoanCreate from "./views/Admin/Loans/LoanCreate.tsx";
import ReturnBook from "./views/Admin/Loans/ReturnBook.tsx";
import ReportLoanToday from "./views/Admin/Reports/ReportLoanToday.tsx";
import ReportLoanInArrears from "./views/Admin/Reports/ReportLoanInArrears.tsx";
import ReportTotalCollected from "./views/Admin/Reports/ReportTotalCollected.tsx";
import ReportMostBorrowingCareer from "./views/Admin/Reports/ReportMostBorrowingCareer.tsx";
import ReportArrearsByStudent from "./views/Admin/Reports/ReportArrearsByStudent.tsx";
import ReportLoansByStudent from "./views/Admin/Reports/ReportLoansByStudent.tsx";
import ReportBookOutOfCopies from "./views/Admin/Reports/ReportBookOutOfCopies.tsx";
import ReportReverBorrowedBooks from "./views/Admin/Reports/ReportReverBorrowedBooks.tsx";
import ReportSanctionedStudents from "./views/Admin/Reports/ReportSanctionedStudents.tsx";
import ReportMostBorrowingStudent from "./views/Admin/Reports/ReportMostBorrowingStudent.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/dashboard-admin" element={<App />} />
      <Route path="/career-list" element={<CareerList />} />
      <Route path="/career-create" element={<CareerCreate />} />
      <Route path="/career-update/:careerId" element={<CareerEdit />} />
      <Route path="/user-list" element={<UserList />} />
      <Route path="/user-create" element={<UserCreate />} />
      <Route path="/users-update/:userId" element={<UserEdit />} />
      <Route path="/file-upload" element={<FileUpload />} />
      <Route path="/book-create" element={<BookCreate />} />
      <Route path="/book-update/:bookId" element={<BookEdit />} />
      <Route path="/book-search" element={<SearchBook />} />
      <Route path="/return-book" element={<ReturnBook />} />
      <Route path="/report-loans-today" element={<ReportLoanToday />} />
      <Route path="/report-loans-in-arrears" element={<ReportLoanInArrears />} />
      <Route path="/report-total-collected" element={<ReportTotalCollected />} />
      <Route path="/report-most-borrowing-career" element={<ReportMostBorrowingCareer />} />
      <Route path="/report-arrears-by-student" element={<ReportArrearsByStudent />} />
      <Route path="/report-loans-by-student" element={<ReportLoansByStudent />} />
      <Route path="/report-books-out-of-copies" element={<ReportBookOutOfCopies />} />
      <Route path="/report-books-never-borrowed" element={<ReportReverBorrowedBooks />}/>
      <Route path="/report-sanctioned-students" element={<ReportSanctionedStudents />}/>
      <Route path="/report-most-borrowing-student" element={<ReportMostBorrowingStudent />}/>
    </Routes>
  </BrowserRouter>
);
