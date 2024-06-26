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
import { Link, useNavigate } from "react-router-dom";


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
    imgUrl: string,
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
  function Book({ title, imgUrl,id }: { title: string; imgUrl: string, id:number }) {
    return (
     
      <div className="book">
         <Link to={`/book-update/${id}`} className="link">
        <h5 className="bookTitle">
          {title}
        </h5>
      <div className="bookImageContainer">
        <img className="bookImage"
          alt={`image of ${title}`}
          src={imgUrl}
        />
        </div>
        </Link>
      </div>

    );
  }
  React.useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "http://54.196.99.149:8085/api/v1/books?page=" +
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
            maxHeight: "550px",
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
            .map(({ id, title, imgUrl }) => (
              <Book key={id} title={title} imgUrl={imgUrl ? imgUrl : "https://islandpress.org/files/default_book_cover_2015.jpg"} id={id}/>
            ))}
        </div>
      </div>
      <Pagination onChange={handleChangePage} className="pagination-container" count={totalPages} color="secondary" />
    </div>
    </ThemeProvider>
  );
}
