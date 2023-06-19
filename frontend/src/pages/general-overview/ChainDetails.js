import { Avatar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";

export const ChainDetails = (props) => {
  const { chainID } = props;
  const balance = useSelector(
    (state) => state.bank.balances?.[chainID]?.list || []
  );
  const rewards = useSelector(
    (state) => state.distribution.chains[chainID].delegatorRewards.totalRewards
  );
  const staked = useSelector(
    (state) => state.staking.chains[chainID].delegations.totalStaked
  );
  const wallet = useSelector((state) => state.wallet);
  const denom = wallet.networks[chainID].network.config.currencies[0].coinDenom;
  const decimals =
    wallet.networks[chainID].network.config.currencies[0].coinDecimals;

  return (
    <>
      {balance.length > 0 ? (
        <StyledTableRow>
          <StyledTableCell size="small">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ width: 24, height: 24 }} />
              &nbsp;&nbsp;
              <Typography>{chainID}</Typography>
            </Box>
          </StyledTableCell>
          <StyledTableCell>
            {(+balance[0].amount / 10 ** decimals).toLocaleString()}&nbsp;
            {denom}
          </StyledTableCell>
          <StyledTableCell>
            {(+staked / 10 ** decimals).toLocaleString()}&nbsp;{denom}
          </StyledTableCell>
          <StyledTableCell>
            {(+rewards / 10 ** decimals).toLocaleString()}&nbsp;{denom}
          </StyledTableCell>
        </StyledTableRow>
      ) : null}
    </>
  );
};
