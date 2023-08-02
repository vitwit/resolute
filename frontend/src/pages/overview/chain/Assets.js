import React from "react";
import PropTypes from "prop-types";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/CustomTable";
import {
  Box,
  Avatar,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import chainDenoms from "../../../utils/chainDenoms.json";
import { useDispatch, useSelector } from "react-redux";
import { getTokenPrice } from "../../../features/common/commonSlice";
import { parseBalance } from "../../../utils/denom";

const Assets = (props) => {
  const { balances, chainName, chainInfo } = props;
  const dispatch = useDispatch();

  const tokensPriceInfo = useSelector(
    (state) => state.common?.allTokensInfoState?.info
  );
  const originMinimalDenom =
    chainInfo?.config?.currencies?.[0]?.coinMinimalDenom;
  const ibcChainLogoUrl =
    "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/";

  return (
    <div>
      <TableContainer>
        {balances?.length ? (
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Network Name</StyledTableCell>
                <StyledTableCell>Available Balance</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {balances?.map((item, index) => {
                const denomInfo = chainDenoms[chainName]?.filter((x) => {
                  return x.denom === item.denom;
                });
                return denomInfo?.length ? (
                  <StyledTableRow key={index}>
                    <StyledTableCell size="small">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={ibcChainLogoUrl + denomInfo[0]?.image}
                          sx={{
                            width: 28,
                            height: 28,
                          }}
                        />
                        &nbsp;&nbsp;
                        <Box>
                          <Typography
                            sx={{
                              textTransform: "capitalize",
                            }}
                          >
                            {denomInfo[0]?.origin_chain}
                            <Typography
                              sx={{
                                backgroundColor: "#767676",
                                borderRadius: "4px",
                                ml: "4px",
                                px: "4px",
                                fontWeight: 600,
                                display: "inline",
                                color: "white",
                                fontSize: "14px",
                              }}
                            >
                              IBC
                            </Typography>
                          </Typography>
                          <Typography
                            sx={{
                              textTransform: "capitalize",
                              fontSize: "14px",
                            }}
                          >
                            On {chainName}
                          </Typography>
                        </Box>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      {parseBalance(
                        balances,
                        denomInfo[0]?.decimals,
                        item.denom
                      ).toLocaleString()}
                      &nbsp;
                      {denomInfo[0].symbol}
                    </StyledTableCell>
                    <StyledTableCell>
                      {tokensPriceInfo[denomInfo[0]?.origin_denom]
                        ? `$${parseFloat(
                            tokensPriceInfo[denomInfo[0]?.origin_denom]?.info?.[
                              "usd"
                            ]
                          ).toFixed(2)}`
                        : "N/A"}
                    </StyledTableCell>
                  </StyledTableRow>
                ) : (
                  <></>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Typography
          sx={{
            textTransform: "capitalize",
          }}
        >
          No Assets
        </Typography>
        )}
      </TableContainer>
    </div>
  );
};

Assets.propTypes = {
  balances: PropTypes.object.isRequired,
  chainID: PropTypes.string.isRequired,
};

export default Assets;
