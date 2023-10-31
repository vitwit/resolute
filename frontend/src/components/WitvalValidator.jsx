import React from "react";
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
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";

export function WitvalValidator(props) {
  const { validator, onMenuAction, chainID } = props;

  const wallet = useSelector(state => state.wallet);
  const coinDecimals = wallet?.networks[chainID]?.network?.config?.currencies[0]?.coinDecimals || 6;

  const theme = useTheme();
  return (
    <>
      {validator?.description?.moniker === "Witval" ? (
        <Paper
          elevation={0}
          sx={{
            p: 1,
            borderRadius: "none",
          }}
        >
          <Typography
            sx={{
              p: 1,
              textAlign: "left",
            }}
            color="text.primary"
            fontWeight={500}
            variant="body1"
          >
            Love us by delegating to Witval
          </Typography>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: "none",
            }}
          >
            <Table
              sx={{ minWidth: 500 }}
              aria-label="simple table"
              size="small"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">Validator</StyledTableCell>
                  <StyledTableCell align="left">Voting Power</StyledTableCell>
                  <StyledTableCell align="center">Commission</StyledTableCell>
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
                  <StyledTableCell align="left">
                    {formatVotingPower(validator.tokens, coinDecimals)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {(validator.commission.commission_rates.rate * 100).toFixed(
                      2
                    )}
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
                      onClick={(e) => onMenuAction(e, "delegate", validator)}
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
                      onClick={(e) => onMenuAction(e, "undelegate", validator)}
                      sx={{
                        textTransform: "none",
                      }}
                      disableElevation
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
