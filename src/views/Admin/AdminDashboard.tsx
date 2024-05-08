import {
  Divider,
  IconButton,
  InputBase,
  Pagination,
  Paper,
  TextField,
  createTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";
import "../../styles/AdminDashboard.css";
import { ThemeProvider } from "@emotion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function AdminDashbaord() {
  const theme = createTheme({
    palette: {
      secondary: {
        main: '#FFFFFF'
      }
    }
  });
  interface Book {
    id: number;
    isbnCode: string;
    author: number;
    title: string;
    publicationDate: Date;
    publisher: string;
    availableCopies: number;
    timesBorrowed:number,
    imgSrc: string,
  };
  
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(10);
  const navigate = useNavigate();
  const auth = localStorage.getItem("auth");
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage - 1);
    console.log(page);
  };
  function Book({ title, imgSrc }: { title: string; imgSrc: string }) {
    return (
      <div className="book">
        <h5 className="bookTitle">
          {title}
        </h5>
      <div className="bookImageContainer">
        <img className="bookImage"
          alt={`image of ${title}`}
          src={imgSrc}
        />
        </div>
      </div>
    );
  }
  React.useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/books?page=" +
            page +"&name="+search,
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
          navigate("/login");
        }
        if (!response.ok) {
          throw new Error("Error al cargar los libros");
        }
        console.log(data);
        setBooks(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        navigate("/");
        console.error(error);
      }
    };
  
    fetchBooks();
  }, [page, search]);
  return (
    <ThemeProvider theme={theme}>
    <div className="admin-dashboard">
      <div className="search-container">
        <InputBase
          className="search-input"
          placeholder="Search Book Name"
          inputProps={{ "aria-label": "search book name" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton
          className="search-button"
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </div>
      <div className="book-container">
      <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.65em",
          }}
        >
          {books
            .filter(({ title }) =>
              title
                .toLowerCase()
                .trim()
                .includes("".toLowerCase().trim())
            )
            .map(({ id, title, imgSrc }) => (
              <Book key={id} title={title} imgSrc={imgSrc ? imgSrc : "https://islandpress.org/files/default_book_cover_2015.jpg"} />
            ))}
        </div>
      </div>
      <Pagination onChange={handleChangePage} className="pagination-container" count={totalPages} color="secondary" />
    </div>
    </ThemeProvider>
  );
}
