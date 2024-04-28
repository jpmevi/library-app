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
  onClick: () => void;
}

interface Data {
  [key: string]: number | string;
}

interface StickyHeadTableProps {
  columns: Column[];
  rows: any[];
  actions?: Action[];
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StickyHeadTable(props: StickyHeadTableProps) {
  const {
    columns,
    rows,
    actions,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;
  const theme = createTheme({
    palette: {
      secondary: {
        main: '#FFFFFF'
      }
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <Paper
        className="paperContainer"
        sx={{ width: "100%", overflow: "hidden" }}
      >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: "#BAF266",
                      color: "black",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                {actions && actions.length > 0 && (
                  <TableCell>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow key={rowIndex} hover role="checkbox" tabIndex={-1}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value as number)
                            : value}
                        </TableCell>
                      );
                    })}
                    {actions && actions.length > 0 && (
                      <TableCell align="center">
                        {actions.map((action, index) => (
                          <IconButton
                            key={index}
                            aria-label={`Action ${index + 1}`}
                            onClick={action.onClick}
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
          count={10}
          color="secondary"
        />
      </Paper>
    </ThemeProvider>
  );
}
