import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import { StyledTableCell, StyledTableRow } from "./CustomTable";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { formatValidatorStatus } from "../utils/util";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useTheme } from "@emotion/react";

export function MyDelegations(props) {
  const { delegations, validators, onDelegationAction, currency, rewards } =
    props;
  const [totalRewards, setTotalRewards] = React.useState(0);
  const distTxStatus = useSelector((state) => state.distribution.tx);
  const [rewardsP, setRewardsP] = React.useState({});

  const theme = useTheme();

  useEffect(() => {
    let total = 0.0;
    if (rewards.length > 0) {
      for (let i = 0; i < rewards.length; i++)
        if (rewards[i].reward.length > 0) {
          const reward = rewards[i]?.reward[0];
          let temp = rewardsP;
          temp[rewards[i].validator_address] =
            parseFloat(reward.amount) / 10 ** currency?.coinDecimals;
          setRewardsP(temp);
          total += parseFloat(reward.amount) / 10 ** currency?.coinDecimals;
        } else {
          let temp = rewardsP;
          temp[rewards[i].validator_address] = 0.0;
          setRewardsP(temp);
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
    <Paper
      elevation={0}
      sx={{
        p: 2,
      }}
    >
      <Box
        component="div"
        sx={{
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography>
          Total staked:&nbsp;
          {parseFloat(delegations.totalStaked) / 10 ** currency?.coinDecimals}
          {currency?.coinDenom}
        </Typography>

        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
          }}
          disableElevation
          onClick={() => props.onWithdrawAllRewards()}
          disabled={
            distTxStatus?.status === "pending" || Number(totalRewards) === 0
          }
        >
          {distTxStatus?.status === "pending" ? (
            <CircularProgress size={25} />
          ) : (
            `Claim Rewards: ${totalRewards} ${currency?.coinDenom}`
          )}
        </Button>
      </Box>
      <TableContainer component={Paper} elevation={0}>
        {delegations?.status === "pending" ? (
          delegations?.delegations.length === 0 ? (
            <CircularProgress />
          ) : (
            <></>
          )
        ) : delegations?.delegations.length === 0 ? (
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
                <StyledTableCell align="center">Comission</StyledTableCell>
                <StyledTableCell align="center">Delegated</StyledTableCell>
                <StyledTableCell align="center">Rewards</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {delegations?.delegations.map((row, index) => (
                <StyledTableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {
                      validators?.active[row.delegation.validator_address]
                        ?.description.moniker
                    }
                    <br />
                    {validators.active[row.delegation.validator_address]?.jailed
                      ? formatValidatorStatus(true, null)
                      : formatValidatorStatus(
                          false,
                          validators.active[row.delegation.validator_address]
                            ?.status
                        )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {(
                      validators?.active[row.delegation.validator_address]
                        ?.commission.commission_rates.rate * 100
                    ).toFixed(2)}
                    %
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {parseFloat(row.delegation.shares) /
                      10 ** currency?.coinDecimals}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {rewardsP[row.delegation.validator_address]?.toFixed(6)}
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
                        handleClick(e, "delegate", row.delegation)
                      }
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
                      onClick={(e) =>
                        handleClick(e, "undelegate", row.delegation)
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
                        handleClick(e, "redelegate", row.delegation)
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
        )}
      </TableContainer>
    </Paper>
  );
}
