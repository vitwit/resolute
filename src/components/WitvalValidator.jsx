import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { StyledTableCell, StyledTableRow } from "./CustomTable";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { formatVotingPower } from "../utils/denom";
import Typography from "@mui/material/Typography";
import { formatValidatorStatus } from "../utils/util";

export function WitvalValidator(props) {
  const { validators, onMenuAction } = props;
  const [validator, setValidator] = useState({});

  const getWitvalValidator = () => {
    const keys = Object.keys(validators?.active);
    for (let i = 0; i < keys.length; i++) {
      if (validators.active[keys[i]]?.description?.moniker === "Witval") {
        setValidator(validators.active[keys[i]]);
        return;
      }
    }
    for (let i = 0; i < keys.length; i++) {
      if (validators.inactive[keys[i]]?.description?.moniker === "Witval") {
        setValidator(validators.inactive[keys[i]]);
        return;
      }
    }
  };

  useEffect(() => {
    getWitvalValidator();
  }, [validators]);

  return (
    <>
      {validator?.description?.moniker === "Witval" ? (
        <Paper elevation={0} style={{ padding: 12 }}>
          <Typography
            style={{ padding: 12, textAlign: "left" }}
            color="text.primary"
            fontWeight={600}
            variant="body1"
          >
            Help Witval By Staking
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table
              sx={{ minWidth: 500 }}
              aria-label="simple table"
              size="small"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">Validator</StyledTableCell>
                  <StyledTableCell align="center">Voting Power</StyledTableCell>
                  <StyledTableCell align="center">Comission</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow
                  key={1}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell align="center">
                    {validator?.description.moniker}
                    <br />
                    {validator?.jailed
                      ? formatValidatorStatus(true, null)
                      : formatValidatorStatus(false, validator?.status)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {formatVotingPower(validator.tokens)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {(validator.commission.commission_rates.rate * 100).toFixed(
                      2
                    )}
                    %
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      variant="outlined"
                      className="button-capitalize-title"
                      size="small"
                      onClick={(e) => onMenuAction(e, "delegate", validator)}
                    >
                      Delegate
                    </Button>
                    <Button
                      variant="outlined"
                      style={{ marginLeft: 4 }}
                      className="button-capitalize-title"
                      size="small"
                      onClick={(e) => onMenuAction(e, "undelegate", validator)}
                    >
                      Undelegate
                    </Button>
                    {/* <Button
                                        variant="outlined"
                                        size="small" onClick={(e) => onMenuAction(e, "redelegate", validators.active[keyName])}
                                    >
                                        Redelegate
                                    </Button> */}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <></>
      )}
    </>
  );
}
