import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import PropTypes from "prop-types";
import { shortenAddress } from "../../utils/util";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f5f5f5",
    color: theme.palette.common.black,
    textAlign: "center",
    fontSize: 18,
    textAlign: "left",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
    textAlign: "left",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.common.white,
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const MembersTable = (props) => {
  const { members, pagination } = props;

  const total = members.length || 0;
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(event.target.value);
  };

  return (
    <TableContainer sx={{ mt: 2 }} elevation={0} component={Paper}>
      <Table size="small" aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Address</StyledTableCell>
            <StyledTableCell align="right">Weight</StyledTableCell>
            <StyledTableCell align="right">Metadata</StyledTableCell>
            {/* <StyledTableCell align="right">Action</StyledTableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {members
            .slice(currentPage * perPage, (currentPage + 1) * perPage)
            .map((row, index) => (
              <StyledTableRow key={index * (currentPage + 1)}>
                <StyledTableCell component="th" scope="row">
                  {shortenAddress(row?.member?.address, 26) || "-"}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row?.member?.weight || "-"}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row?.member?.metadata || "-"}
                </StyledTableCell>
                {/* <StyledTableCell align="right">
                <Tooltip title={"Delete"} arrow>
                  <IconButton
                    onClick={() => {
                      // handleDeleteMember({
                      //   address: row?.member?.address,
                      //   weight: "0",
                      //   metadata: row?.member?.metadata,
                      // });
                    }}
                    color="error"
                  >
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </StyledTableCell> */}
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={total || 0}
        rowsPerPage={perPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

MembersTable.propTypes = {
  members: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
};

export default MembersTable;
