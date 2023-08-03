import React, { useEffect, useState } from "react";
import { StyledTableCell, StyledTableRow } from "./CustomTable";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { formatVotingPower } from "../utils/denom";
import { formatValidatorStatus } from "../utils/util";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";

export function InActiveValidators(props) {
  const { onMenuAction, chainID } = props;
  const validators = useSelector(
    (state) => state.staking.chains[chainID].validators
  );
  const delegatedTo = useSelector(
    (state) => state.staking.chains[chainID].delegations.delegatedTo
  );

  const [inactiveVals, setInactiveVals] = useState(validators.inactiveSorted);

  useEffect(() => {
    setInactiveVals(validators.inactiveSorted);
  }, [validators]);

  const theme = useTheme();

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
            {inactiveVals
              .map((keyName, index) => (
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
                    {validators.inactive[keyName]?.jailed ? (
                      <></>
                    ) : (
                      <Button
                        variant={
                          theme.palette?.mode === "light"
                            ? "outlined"
                            : "contained"
                        }
                        className="button-capitalize-title"
                        size="small"
                        onClick={(e) =>
                          onMenuAction(
                            e,
                            "delegate",
                            validators.inactive[keyName]
                          )
                        }
                        sx={{
                          textTransform: "none",
                        }}
                        disableElevation
                      >
                        Delegate
                      </Button>
                    )}
                    {delegatedTo[keyName] ? (
                      <>
                        <Button
                          style={{ marginLeft: 4 }}
                          variant={
                            theme.palette?.mode === "light"
                              ? "outlined"
                              : "contained"
                          }
                          className="button-capitalize-title"
                          size="small"
                          onClick={(e) =>
                            onMenuAction(
                              e,
                              "undelegate",
                              validators.inactive[keyName]
                            )
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
                          variant={
                            theme.palette?.mode === "light"
                              ? "outlined"
                              : "contained"
                          }
                          className="button-capitalize-title"
                          size="small"
                          onClick={(e) =>
                            onMenuAction(
                              e,
                              "redelegate",
                              validators.inactive[keyName]
                            )
                          }
                          sx={{
                            textTransform: "none",
                          }}
                          disableElevation
                        >
                          Redelegate
                        </Button>
                      </>
                    ) : (
                      <></>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
