import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import PropTypes from "prop-types";
import { shortenAddress } from "../../utils/util";
import { StyledTableCell, StyledTableRow } from "./../CustomTable";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import { Chip } from "@mui/material";
import { copyToClipboard } from "../../utils/clipboard";
import { useDispatch } from "react-redux";

const MembersTable = (props) => {
  const { members } = props;

  const total = members.length || 0;
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const dispatch = useDispatch();

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(event.target.value);
  };

  return (
    <TableContainer sx={{ mt: 2 }} elevation={0} component={Paper}>
      <Table aria-label="simple table" size="small">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Address</StyledTableCell>
            <StyledTableCell align="left">Weight</StyledTableCell>
            <StyledTableCell align="left">Name</StyledTableCell>
            {/* <StyledTableCell align="right">Action</StyledTableCell> */}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {members
            .slice(currentPage * perPage, (currentPage + 1) * perPage)
            .map((row, index) => (
              <StyledTableRow key={index * (currentPage + 1)}>
                <StyledTableCell component="th" scope="row">
                  {/* {shortenAddress(row?.member?.address, 26) || "-"} */}
                  <Chip
                      label={shortenAddress(row?.member?.address, 24)}
                      size="small"
                      deleteIcon={<ContentCopyOutlined />}
                      onDelete={() => {
                        copyToClipboard(row?.member?.address, dispatch);
                      }}
                    />
                </StyledTableCell>
                <StyledTableCell align="left">
                  &nbsp;&nbsp;{row?.member?.weight || "-"}
                </StyledTableCell>
                <StyledTableCell align="left">
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
