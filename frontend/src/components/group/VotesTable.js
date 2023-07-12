import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { Typography } from "@mui/material";
import { getLocalTime } from "../../utils/datetime";

const votesStatus = {
  VOTE_OPTION_YES: {
    label: "Yes",
    bgColor: "#d8ead8",
    color: "green",
  },
  VOTE_OPTION_NO: {
    label: "NO",
    bgColor: "#edcdcd",
    color: "red",
  },
  VOTE_OPTION_ABSTAIN: {
    label: "ABSTAIN",
    bgColor: "#cdd1ed",
    color: "#0026ff",
  },
  VOTE_OPTION_NO_WITH_VETO: {
    label: "NO WITH VETO",
    bgColor: "#f2dbf1",
    color: "#df00fa",
  },
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    textAlign: "center",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function VotesTable({
  rows,
  total,
  pageNumber = 0,
  limit,
  handleMembersPagination,
}) {
  const [page, setPage] = React.useState(pageNumber);
  const [rowsPerPage, setRowsPerPage] = React.useState(limit);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);

    handleMembersPagination(
      Number(newPage),
      rowsPerPage,
      rows?.pagination?.next_key
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(+event.target.value);

    handleMembersPagination(Number(page), +event.target.value, "");
  };

  return (
    <>
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{
          textAlign: "left",
        }}
        gutterBottom
      >
        Votes
      </Typography>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          p: 2,
          width: "98%",
        }}
      >
        {!rows?.votes?.length ? (
          <>
            <Typography color="text.primary" variant="h5" sx={{ py: 2 }}>
              No one voted
            </Typography>
          </>
        ) : (
          <>
            <Table
              sx={{ minWidth: 500 }}
              aria-label="customized table"
              size="small"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Member</StyledTableCell>
                  <StyledTableCell align="right">Option</StyledTableCell>
                  <StyledTableCell align="right">Justification</StyledTableCell>
                  <StyledTableCell align="right">Time</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.votes?.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell
                      style={{
                        width: "10%",
                      }}
                      component="th"
                      scope="row"
                    >
                      {row?.voter || "-"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        width: "10%",
                      }}
                      align="right"
                    >
                      <Typography
                        sx={{
                          borderRadius: 25,
                          p: 1,
                          background: votesStatus[row?.option]?.bgColor,
                          color: votesStatus[row?.option]?.color,
                        }}
                      >
                        {votesStatus[row?.option]?.label || "-"}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row?.metadata
                        ? JSON.parse(row?.metadata)?.justification
                        : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {getLocalTime(row?.submit_time) || "-"}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 20, 25, 100]}
              component="div"
              count={total || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TableContainer>
    </>
  );
}
