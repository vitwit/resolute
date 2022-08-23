import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getLocalTime } from "./../../utils/datetime";
import Button from "@mui/material/Button";
import { shortenAddress } from "../../utils/util";
import { CircularProgress, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";

export interface GroupsByMemberProps {
  groups: any;
  status: string;
  onAction: (group: any) => void;
}

export default function GroupsByMember(props: GroupsByMemberProps) {
  const { groups, onAction, status } = props;

  return (
    <>
      {groups.length > 0 ? (
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Total Weight</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups?.map((group: any) => (
                <TableRow
                  key={group.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {group.id}
                  </TableCell>
                  <TableCell>{shortenAddress(group.admin, 19)}</TableCell>
                  <TableCell>{group.version}</TableCell>
                  <TableCell>{group.total_weight}</TableCell>
                  <TableCell>{getLocalTime(group.created_at)}</TableCell>
                  <TableCell>
                    <Link
                      align="center"
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      More Info
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            p: 1,
            justifyContent: "center",
            display: "flex",
          }}
        >
          {status === "pending" ? (
            <CircularProgress size={30} />
          ) : (
            <Typography variant="h6" color="text.primary" fontWeight={600}>
              No Groups found
            </Typography>
          )}
        </Box>
      )}
    </>
  );
}
