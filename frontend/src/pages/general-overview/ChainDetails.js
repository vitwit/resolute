import { Avatar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import { parseBalance } from "../../utils/denom";

export const ChainDetails = (props) => {
  const { chainID, chainName } = props;
  const balance = useSelector(
    (state) => state.bank.balances?.[chainID]?.list || []
  );
  const rewards = useSelector(
    (state) =>
      state.distribution?.chains?.[chainID]?.delegatorRewards?.totalRewards || 0
  );
  const staked = useSelector(
    (state) => state.staking?.chains?.[chainID]?.delegations?.totalStaked || 0
  );
  const wallet = useSelector((state) => state.wallet);
  const denom =
    wallet.networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDenom;
  const minimalDenom =
    wallet.networks?.[chainID]?.network?.config?.currencies?.[0]
      ?.coinMinimalDenom;
  const decimals =
    wallet.networks?.[chainID]?.network?.config?.currencies?.[0]
      ?.coinDecimals || 0;
  const logoURL = wallet?.networks?.[chainID]?.network?.logos?.menu;
  const navigate = useNavigate();

  const handleOnClick = (chainName) => {
    navigate(`/${chainName}/overview`);
  };

  return (
    <>
      {balance?.length > 0 ? (
        <StyledTableRow>
          <StyledTableCell size="small">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={logoURL}
                sx={{
                  width: 24,
                  height: 24,
                  "&:hover": {
                    backgroundColor: "white",
                    cursor: "pointer",
                  },
                }}
                onClick={() => handleOnClick(chainName)}
              />
              &nbsp;&nbsp;
              <Typography
                sx={{
                  textTransform: "capitalize",
                  "&:hover": {
                    cursor: "pointer",
                    color: "purple",
                  },
                }}
                onClick={() => handleOnClick(chainName)}
              >
                {chainName}
              </Typography>
            </Box>
          </StyledTableCell>
          <StyledTableCell>
            {parseBalance(balance, decimals, minimalDenom).toLocaleString()}
            &nbsp;
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
