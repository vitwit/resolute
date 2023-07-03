import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { StyledTableCell, StyledTableRow } from "./CustomTable";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { formatVotingPower } from "../utils/denom";
import { formatValidatorStatus } from "../utils/util";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";

export function ActiveValidators(props) {
  const { onMenuAction, chainID } = props;
  const validators = useSelector(
    (state) => state.staking.chains[chainID].validators
  );
  const delegatedTo = useSelector(
    (state) => state.staking.chains[chainID].delegations.delegatedTo
  );

  const [activeVals, setActiveVals] = useState(validators.activeSorted);

  useEffect(() => {
    setActiveVals(validators.activeSorted);
  }, [validators]); // react-hooks/exhaustive-deps

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
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Commission</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {activeVals
              .map((keyName, index) => (
                <StyledTableRow
                  key={index + 1}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {validators.active[keyName]?.description.moniker}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {formatVotingPower(validators.active[keyName]?.tokens, 6)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {validators.active[keyName]?.jailed
                      ? formatValidatorStatus(true, null)
                      : formatValidatorStatus(
                        false,
                        validators.active[keyName]?.status
                      )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {(
                      validators.active[keyName]?.commission.commission_rates
                        .rate * 100
                    ).toFixed(2)}
                    %
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      variant={
                        theme.palette?.mode === "light"
                          ? "outlined"
                          : "contained"
                      }
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
                    {delegatedTo[keyName] ? (
                      <>
                        <Button
                          variant={
                            theme.palette?.mode === "light"
                              ? "outlined"
                              : "contained"
                          }
                          style={{ marginLeft: 4 }}
                          className="button-capitalize-title"
                          size="small"
                          onClick={(e) =>
                            onMenuAction(
                              e,
                              "undelegate",
                              validators.active[keyName]
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
                          variant={
                            theme.palette?.mode === "light"
                              ? "outlined"
                              : "contained"
                          }
                          className="button-capitalize-title"
                          style={{ marginLeft: 4 }}
                          size="small"
                          onClick={(e) =>
                            onMenuAction(
                              e,
                              "redelegate",
                              validators.active[keyName]
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
