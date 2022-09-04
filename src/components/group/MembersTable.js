import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { Typography } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        textAlign: 'center',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 16,
        textAlign: 'center'
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function MembersTable({ rows, total,
    pageNumber = 0, limit, handleMembersPagination }) {
    const [page, setPage] = React.useState(pageNumber);
    const [rowsPerPage, setRowsPerPage] = React.useState(limit);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);

        handleMembersPagination(Number(newPage), rowsPerPage, rows?.pagination?.next_key)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(+event.target.value);

        handleMembersPagination(Number(page), +event.target.value, '')
    };

    return (
        <TableContainer component={Paper}>
            <Typography sx={{ fontSize: 24, m: 2, float: 'left' }}>Group Members</Typography><br />
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Address</StyledTableCell>
                        <StyledTableCell align="right">Weight</StyledTableCell>
                        <StyledTableCell align="right">Metadata</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows?.members?.map((row) => (
                        <StyledTableRow key={row.name}>
                            <StyledTableCell style={{
                                width: '10%'
                            }} component="th" scope="row">
                                {row?.member?.address || '-'}
                            </StyledTableCell>
                            <StyledTableCell style={{
                                width: '10%'
                            }} align="right">{row?.member?.weight || '-'}</StyledTableCell>
                            <StyledTableCell

                                align="right">{row?.member?.metadata || '-'}</StyledTableCell>
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
        </TableContainer>
    );
}
