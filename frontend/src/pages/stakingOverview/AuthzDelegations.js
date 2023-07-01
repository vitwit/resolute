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
import { useSelector } from "react-redux";

function AuthzDelegations(props) {
  const {
    chainID,
    delegations,
    validators,
    currency,
    undelegateAuthzGrants,
    redelegateAuthzGrants,
    granter,
    rewards,
    setTotalRewards,
    totalRewards,
    onDelegationAction,
  } = props;

  const theme = useTheme();

  const [rewardsP, setRewardsP] = React.useState({});

  useEffect(() => {
    let total = 0.0;
    if (rewards?.length > 0) {
      for (let i = 0; i < rewards.length; i++) {
        if (rewards[i].reward.length > 0) {
          const reward = rewards[i].reward;
          for (let j = 0; j < reward.length; j++) {
            if (reward[j].denom === currency.coinMinimalDenom) {
              let temp = rewardsP;
              temp[rewards[i].validator_address] =
                parseFloat(reward[j].amount) / 10 ** currency?.coinDecimals;
              setRewardsP(temp);
              total +=
                parseFloat(reward[j].amount) / 10 ** currency?.coinDecimals;
            }
          }
        } else {
          let temp = rewardsP;
          temp[rewards[i].validator_address] = 0.0;
          setRewardsP(temp);
        }
      }
    }

    setTotalRewards(total.toFixed(5));
  }, [rewards]);

  const handleClick = (event, type, delegation) => {
    let val = {};
    if (delegation.validator_address in validators?.active) {
      val = validators?.active[delegation.validator_address];
    } else {
      val = validators?.inactive[delegation.validator_address];
    }
    onDelegationAction(event, type, val);
  };

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        {delegations?.status === "pending" ? (
          delegations?.delegations?.delegations?.length === 0 ? (
            <CircularProgress />
          ) : (
            <></>
          )
        ) : delegations?.delegations?.delegations?.length === 0 ? (
          <Typography
            variant="h6"
            color="text.primary"
            style={{ display: "flex", justifyContent: "center", padding: 4 }}
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
                <StyledTableCell align="center">Rewards</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {delegations?.delegations?.delegations.map((row, index) => {
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
                            validators.active[
                              row?.delegation?.validator_address
                            ]?.status
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
                    <StyledTableCell align="center">
                      {rewardsP[row?.delegation?.validator_address]
                        ?.toFixed(3)
                        .toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">
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
                          handleClick(e, "undelegate", row.delegation)
                        }
                        sx={{
                          textTransform: "none",
                        }}
                        disableElevation
                        disabled={!undelegateAuthzGrants?.includes(granter)}
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
                          handleClick(e, "redelegate", row.delegation)
                        }
                        sx={{
                          textTransform: "none",
                        }}
                        disableElevation
                        disabled={!redelegateAuthzGrants?.includes(granter)}
                      >
                        Redelegate
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </>
  );
}

export default AuthzDelegations;
