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
const theme = createTheme({
  palette: {
    secondary: {
      main: '#FFFFFF'
    }
  }
});
const books = [
  {
    id: 1,
    title: "A Song of Ice and Fire",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/song-of-ice-and-fire.jpeg",
  },
  {
    id: 2,
    title: "The Name of the Wind",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/the-name-of-the-wind.jpeg",
  },
  {
    id: 3,
    title: "The Way of Kings",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/the-way-of-kings.png",
  },
  {
    id: 4,
    title: "The Lies of Locke Lamora",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/the-lies-of-locke-lamora.webp",
  },
  {
    id: 5,
    title: "Dune",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/dune.jpeg",
  },
  {
    id: 6,
    title: "Neuromancer",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/neuromancer.jpeg",
  },
  {
    id: 7,
    title: "Foundation",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/foundation.jpeg",
  },
  {
    id: 8,
    title: "Ender's Game",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/enders-game.jpg",
  },
  {
    id: 9,
    title: "The Girl with the Dragon Tattoo",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/the-girl-with-the-dragon-tattoo.jpeg",
  },
  {
    id: 10,
    title: "Gone Girl",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/gone-girl.jpeg",
  }
];
function Book({ title, imgSrc }: { title: string; imgSrc: string }) {
  return (
    <div
      style={{
        borderRadius: "16px",
        margin: "1%",
        width: "274px",
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        backgroundColor: "#595959",
      }}
    >
      <h5
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "12",
        }}
      >
        {title}
      </h5>
      <img
        alt={`image of ${title}`}
        src={imgSrc}
        style={{ width: "auto", height: "225px", margin: "auto", marginBottom: "10px" }}
      />
    </div>
  );
}

export default function AdminDashbaord() {
  return (
    <ThemeProvider theme={theme}>
    <div className="admin-dashboard">
      <div className="search-container">
        <InputBase
          className="search-input"
          placeholder="Search Book Name"
          inputProps={{ "aria-label": "search book name" }}
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
              <Book key={id} title={title} imgSrc={imgSrc} />
            ))}
        </div>
      </div>
      <Pagination className="pagination-container" count={10} color="secondary" />
    </div>
    </ThemeProvider>
  );
}
