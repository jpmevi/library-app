import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import { Pagination, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

interface Action {
  icon: React.ReactElement;
  onClick: (id: string) => void;
}

interface Data {
  [key: string]: number | string;
}

interface StickyHeadTableProps {
  columns: Column[];
  rows: any[];
  actions?: Action[];
  page: number;
  totalPages: number;
  handleChangePage: (event: unknown, newPage: number) => void;
}

export default function StickyHeadTable(props: StickyHeadTableProps) {
  const { columns, rows, actions, page, totalPages, handleChangePage } = props;
  const theme = createTheme({
    palette: {
      secondary: {
        main: "#FFFFFF",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Paper
        className="paperContainer"
        sx={{ width: "100%", overflow: "hidden", backgroundColor: "#383838"}}
      >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{
                      minWidth: column.minWidth,
                      backgroundColor: "#BAF266",
                      color: "black", 
                      
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell sx={{
                    backgroundColor: "#BAF266",
                    color: "black",
                    '&:hover': {
                      backgroundColor: "#4CAF50", // Hover color for action cell
                    },
                  }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex} hover role="checkbox" tabIndex={-1}
                  sx={{
                    '&:hover': {
                      backgroundColor: "#DAF280",
                      color: "black" // Hover color for table rows
                    },
                  }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align} sx={{
                        backgroundColor: "#383838",
                        color: "white",
                        '&:hover': {
                          backgroundColor: "#DAF280",
                          color: "black"// Ensuring hover effect
                        },
                      }}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                  {actions && (
                    <TableCell align="center" sx={{
                      backgroundColor: "#383838",
                      color: "white",
                      '&:hover': {
                        color: "black"
                      },
                    }}>
                      {actions.map((action, index) => (
                        <IconButton
                          key={index}
                          sx={{
                            color: "white",
                            '&:hover': {
                              backgroundColor: "white",
                              color: "black", // Hover effect for icons
                            },
                          }}
                          onClick={() => action.onClick(row.userId ? row.userId : row.id ? row.id : row.code)}
                        >
                          {action.icon}
                        </IconButton>
                      ))}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          className="pagination-container"
          count={totalPages}
          onChange={handleChangePage}
          color="secondary"
        />
      </Paper>
    </ThemeProvider>
  );
}
