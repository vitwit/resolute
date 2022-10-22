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
import { IconButton, Tooltip, Typography } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#f5f5f5',
        color: theme.palette.common.black,
        textAlign: 'center',
        fontSize: 18,
        textAlign: 'left'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 18,
        textAlign: 'left',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.common.white,
    },
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function MembersTable({ rows, total,
    pageNumber = 0, limit, handleMembersPagination, handleDeleteMember }) {
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
        <TableContainer sx={{borderRadius: 2.5, mt: 10}} component={Paper}>
            <Table 
                aria-label="customized table">
                <TableHead sx={{ border: '2px solid #d5d5d5' }}>
                    <TableRow>
                        <StyledTableCell>Address</StyledTableCell>
                        <StyledTableCell align="right">Weight</StyledTableCell>
                        <StyledTableCell align="right">Metadata</StyledTableCell>
                        <StyledTableCell align="right">Action</StyledTableCell>
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
                            }} align="right">
                                {row?.member?.weight || '-'}
                            </StyledTableCell>
                            <StyledTableCell
                                align="right">
                                {row?.member?.metadata || '-'}
                            </StyledTableCell>
                            <StyledTableCell
                                align="right">
                                <Tooltip title={'Delete'} arrow>
                                    <IconButton onClick={() => {
                                        handleDeleteMember({
                                            address: row?.member?.address,
                                            weight: '0',
                                            metadata: row?.member?.metadata
                                        })
                                    }} color='error'>
                                        <DeleteOutline />
                                    </IconButton>
                                </Tooltip>

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
        </TableContainer>
    );
}
