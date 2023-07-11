import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Table,
  TableBody,
  TableHead,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import GroupTab, { TabPanel } from "../../components/group/GroupTab";
import { shortenAddress, getTypeURLName } from "../../utils/util";
import { renderExpiration } from "./Feegrant";
import { FeegrantInfo } from "../../components/FeegrantInfo";
import { txRevoke } from "../../features/feegrant/feegrantSlice";

export const ChainGrants = (props) => {
  const { chainName, chainID } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chainGrantsToMe = useSelector(
    (state) => state.feegrant.allGrantsToMe?.[chainID]
  );
  const chainGrantsByMe = useSelector(
    (state) => state.feegrant.allGrantsByMe?.[chainID]
  );
  const chainInfo = useSelector(
    (state) => state.wallet?.networks?.[chainID]?.network
  );
  const feegrant = useSelector((state) => state.common.feegrant?.[chainName]);
  const txStatus = useSelector((state) => state.feegrant.tx);
  const currency = chainInfo?.config?.currencies[0];
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = React.useState({});
  const [infoOpen, setInfoOpen] = React.useState(false);

  const handleTabChange = (value) => {
    setTab(value);
  };
  const handleInfoClose = (value) => {
    setInfoOpen(false);
  };

  const revoke = (a) => {
    dispatch(
      txRevoke({
        granter: a.granter,
        grantee: a.grantee,
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config.gasPriceStep.average * 10 ** currency.coinDecimals,
        baseURL: chainInfo.config.rest,
        feegranter: feegrant?.granter,
      })
    );
  };

  return chainGrantsByMe?.length || chainGrantsToMe?.length ? (
    <Card elevation={0} sx={{ p: 1, mt: 2 }}>
      <CardContent>
        <Grid container>
          <Grid item>
            <div
              style={{
                display: "flex",
              }}
            >
              <Avatar
                src={chainInfo.logos.menu}
                sx={{
                  width: 36,
                  height: 36,
                }}
              />
              <Typography
                align="left"
                variant="h6"
                gutterBottom
                color="text.secondary"
                sx={{
                  ml: 1,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => navigate(`/${chainName.toLowerCase()}/feegrant`)}
              >
                {chainName.charAt(0).toUpperCase() + chainName.slice(1)}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </CardContent>
      {selected?.allowance ? (
        <FeegrantInfo
          authorization={selected}
          displayDenom={currency?.coinDenom}
          open={infoOpen}
          onClose={handleInfoClose}
          coinDecimals={currency?.coinDecimals}
        />
      ) : (
        <></>
      )}
      <GroupTab
        tabs={[
          {
            title: "Granted By Me",
          },
          {
            title: "Granted To Me",
          },
        ]}
        handleTabChange={handleTabChange}
      />
      <TabPanel value={tab} index={0} key={"by-me"}>
        <>
          {!chainGrantsByMe?.length ? (
            <Typography
              variant="h6"
              color="text.primary"
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 16,
              }}
            >
              No Feegrant found
            </Typography>
          ) : (
            <>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
              >
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Grantee</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Expiration</StyledTableCell>
                    <StyledTableCell>Details</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {chainGrantsByMe.map((row, index) => (
                    <StyledTableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {shortenAddress(row.grantee, 21)}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={getTypeURLName(row.allowance["@type"])}
                          variant="filled"
                          size="medium"
                        />
                      </StyledTableCell>
                      <StyledTableCell>{renderExpiration(row)}</StyledTableCell>
                      <StyledTableCell>
                        <Link
                          onClick={() => {
                            setSelected(row);
                            setInfoOpen(true);
                          }}
                        >
                          Details
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          disableElevation
                          disabled={
                            txStatus?.status === "pending" ? true : false
                          }
                          onClick={() => revoke(row)}
                        >
                          Revoke
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </>
      </TabPanel>
      <TabPanel value={tab} index={1} key="to-me">
        <>
          {!chainGrantsToMe ? (
            <Typography
              variant="h6"
              color="text.primary"
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 16,
              }}
            >
              No Feegrant found
            </Typography>
          ) : (
            <>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
              >
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Granter</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Expiration</StyledTableCell>
                    <StyledTableCell>Details</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {chainGrantsToMe.map((row, index) => (
                    <StyledTableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {shortenAddress(row.granter, 21)}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={getTypeURLName(row.allowance["@type"])}
                          variant="filled"
                          size="medium"
                        />
                      </StyledTableCell>
                      <StyledTableCell>{renderExpiration(row)}</StyledTableCell>
                      <StyledTableCell>
                        <Link
                          onClick={() => {
                            setSelected(row);
                            setInfoOpen(true);
                          }}
                        >
                          Details
                        </Link>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </>
      </TabPanel>
    </Card>
  ) : (
    <></>
  );
};
