import React, { useState } from "react";
import { StyledTableCell, StyledTableRow } from "./CustomTable";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { formatVotingPower } from "../utils/denom";
import { formatValidatorStatus } from "../utils/util";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { Pagination } from "@mui/material";

export function InActiveValidators(props) {
  const { validators, onMenuAction } = props;

  const inactiveVals = Object.keys(validators?.inactive) || [];
  const totalInActive = Number(inactiveVals?.length) || 1;

  const perPage = 10;
  const [validatorsSlice, setValidatorsSlice] = useState(
    inactiveVals.slice(0, perPage)
  );

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table" size="small">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Rank</StyledTableCell>
              <StyledTableCell align="left">Validator</StyledTableCell>
              <StyledTableCell align="center">Voting Power</StyledTableCell>
              <StyledTableCell align="center">Commission</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {validatorsSlice.map((keyName, index) => (
              <StyledTableRow
                key={index + 1}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {validators.inactive[keyName]?.description.moniker}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {formatVotingPower(validators.inactive[keyName]?.tokens, 6)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {(
                    validators.inactive[keyName]?.commission.commission_rates
                      .rate * 100
                  ).toFixed(2)}
                  %
                </StyledTableCell>
                <StyledTableCell>
                  {validators.inactive[keyName]?.jailed
                    ? formatValidatorStatus(true, null)
                    : formatValidatorStatus(
                        false,
                        validators.inactive[keyName]?.status
                      )}
                </StyledTableCell>
                <StyledTableCell align="center">
                  { validators.inactive[keyName]?.jailed ?
                  <></>
                  :
                  <Button
                    variant="outlined"
                    className="button-capitalize-title"
                    size="small"
                    onClick={(e) =>
                      onMenuAction(e, "delegate", validators.active[keyName])
                    }
                    sx={{
                      textTransform: "none",
                    }}
                    disableElevation
                  >
                    Delegate
                  </Button>
                  }
                  <Button
                    style={{ marginLeft: 4 }}
                    variant="outlined"
                    className="button-capitalize-title"
                    size="small"
                    onClick={(e) =>
                      onMenuAction(e, "undelegate", validators.active[keyName])
                    }
                    sx={{
                      textTransform: "none",
                    }}
                    disableElevation
                  >
                    Undelegate
                  </Button>
                  <Button
                    style={{ marginLeft: 4 }}
                    variant="outlined"
                    className="button-capitalize-title"
                    size="small"
                    onClick={(e) =>
                      onMenuAction(e, "redelegate", validators.active[keyName])
                    }
                    sx={{
                      textTransform: "none",
                    }}
                    disableElevation
                  >
                    Redelegate
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalInActive > 0 ? (
        <Box
          component="div"
          sx={{
            textAlign: "center",
            p: 1,
          }}
        >
          <Pagination
            count={Math.ceil(totalInActive / perPage)}
            shape="circular"
            onChange={(_, v) => {
              setValidatorsSlice(
                inactiveVals?.slice((v - 1) * perPage, v * perPage)
              );
            }}
          />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}
