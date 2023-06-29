import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { formatValidatorStatus } from "../../utils/util";
import Typography from "@mui/material/Typography";
import { useTheme } from "@emotion/react";
import { CircularProgress } from "@mui/material";

function AuthzDelegations(props) {
  const { chainID, delegations, validators, currency } = props;
  const theme = useTheme();
  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        {delegations?.status === "pending" ? (
          delegations?.delegations?.length === 0 ? (
            <CircularProgress />
          ) : (
            <></>
          )
        ) : delegations?.delegations?.length === 0 ? (
          <Typography
            variant="h6"
            color="text.primary"
            style={{ display: "flex", justifyContent: "center", padding: 16 }}
          >
            No delegations
          </Typography>
        ) : (
          <Table
            sx={{ minWidth: 500, p: 10 }}
            aria-label="simple table"
            size="small"
          >
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Rank</StyledTableCell>
                <StyledTableCell align="center">Validator</StyledTableCell>
                <StyledTableCell align="center">Commission</StyledTableCell>
                <StyledTableCell align="center">Delegated</StyledTableCell>
                {/* <StyledTableCell align="center">Rewards</StyledTableCell> */}
                <StyledTableCell align="center">Action</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {delegations?.delegations?.delegations.map((row, index) => {
                console.log("row.....");
                console.log(row);
                console.log(parseFloat(row?.delegation?.shares));
                console.log( 10 ** currency?.coinDecimals)
                return (
                  <StyledTableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {
                      validators?.active[row?.delegation?.validator_address]
                        ?.description.moniker
                    }
                    <br />
                    {validators.active[row?.delegation?.validator_address]
                      ?.jailed
                      ? formatValidatorStatus(true, null)
                      : formatValidatorStatus(
                          false,
                          validators.active[row?.delegation?.validator_address]
                            ?.status
                        )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {(
                      validators?.active[row?.delegation?.validator_address]
                        ?.commission?.commission_rates.rate * 100
                    ).toFixed(2)}
                    %
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {(
                      parseFloat(row?.delegation?.shares) /
                      10 ** currency?.coinDecimals
                    )
                      .toFixed(3)
                      .toLocaleString()}
                  </StyledTableCell>
                  {/* <StyledTableCell align="center">
                    {rewardsP[row?.delegation?.validator_address]
                      ?.toFixed(3)
                      .toLocaleString()}
                  </StyledTableCell> */}
                  <StyledTableCell align="center">
                    <Button
                      variant={
                        theme.palette?.mode === "light"
                          ? "outlined"
                          : "contained"
                      }
                      className="button-capitalize-title"
                      size="small"
                      // onClick={(e) =>
                      //   handleClick(e, "delegate", row.delegation)
                      // }
                      sx={{
                        textTransform: "none",
                      }}
                      disableElevation
                    >
                      Delegate
                    </Button>
                    <Button
                      variant={
                        theme.palette?.mode === "light"
                          ? "outlined"
                          : "contained"
                      }
                      style={{ marginLeft: 4 }}
                      className="button-capitalize-title"
                      size="small"
                      // onClick={(e) =>
                      //   handleClick(e, "undelegate", row.delegation)
                      // }
                      sx={{
                        textTransform: "none",
                      }}
                      disableElevation
                    >
                      Undelegate
                    </Button>
                    <Button
                      variant={
                        theme.palette?.mode === "light"
                          ? "outlined"
                          : "contained"
                      }
                      className="button-capitalize-title"
                      style={{ marginLeft: 4 }}
                      size="small"
                      // onClick={(e) =>
                      //   handleClick(e, "redelegate", row.delegation)
                      // }
                      sx={{
                        textTransform: "none",
                      }}
                      disableElevation
                    >
                      Redelegate
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </>
  );
}

export default AuthzDelegations;
