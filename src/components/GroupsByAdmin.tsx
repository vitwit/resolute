import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getLocalTime } from './../utils/datetime';
import Button from '@mui/material/Button';
import { Link } from '@mui/material';

export interface GroupsByAdminProps {
    groups: any;
    onAction: (group: any) => void;
}

export default function GroupsByAdmin(props: GroupsByAdminProps) {
    const { groups, onAction } = props;

    return (
        <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Version</TableCell>
                        <TableCell>Total Weight</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Info</TableCell>
                        <TableCell align='center'>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {groups?.map((group: any) => (
                        <TableRow
                            key={group.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {group.id}
                            </TableCell>
                            <TableCell>
                                {group.version}
                            </TableCell>
                            <TableCell>
                                {group.total_weight}
                            </TableCell>
                            <TableCell>
                                {getLocalTime(group.created_at)}
                            </TableCell>
                            <TableCell>
                            <Link align='center'
                                sx={{
                                    '&:hover': {
                                        cursor: 'pointer'
                                    }
                                }}
                            >
                                More Info
                            </Link>
                            </TableCell>
                            <TableCell align='center'>
                                <Button
                                    className='button-capitalize-title'
                                    onClick={(): void => { onAction(group) }}
                                >
                                    Actions
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
