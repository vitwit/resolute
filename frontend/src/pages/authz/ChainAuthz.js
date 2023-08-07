import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
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
import {
  getTypeURLFromAuthorization,
  getMsgNameFromAuthz,
} from "../../utils/authorizations";
import { getLocalTime } from "../../utils/datetime";
import { txAuthzRevoke } from "../../features/authz/authzSlice";
import { AuthorizationInfo } from "../../components/AuthorizationInfo";
import { CopyToClipboard } from "../../components/CopyToClipboard";

export const ChainAuthz = (props) => {
  const { chainName, chainID } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chainGrantsToMe = useSelector(
    (state) => state.authz.grantsToMe?.[chainID]
  );
  const chainGrantsByMe = useSelector(
    (state) => state.authz.grantsByMe?.[chainID]
  );
  const chainInfo = useSelector(
    (state) => state.wallet?.networks?.[chainID]?.network
  );
  const feegrant = useSelector((state) => state.common.authz?.[chainName]);
  const authzTx = useSelector((state) => state.authz.tx);
  const currency = chainInfo?.config?.currencies[0];
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = React.useState({});
  const [infoOpen, setInfoOpen] = React.useState(false);
  const [selectedRevoke, setSelectedRevoke] = React.useState(-1);

  const handleTabChange = (value) => {
    setTab(value);
  };
  const handleInfoClose = (value) => {
    setInfoOpen(false);
  };

  const revoke = (a, index) => {
    setSelectedRevoke(index);
    dispatch(
      txAuthzRevoke({
        granter: a.granter,
        grantee: a.grantee,
        typeURL: getTypeURLFromAuthorization(a.authorization),
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average *
          10 ** currency.coinDecimals,
        baseURL: chainInfo.config.rest,
        feegranter: feegrant?.granter,
      })
    );
  };

  return chainGrantsByMe?.grants?.length || chainGrantsToMe?.grants?.length ? (
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
                onClick={() => navigate(`/${chainName.toLowerCase()}/authz`)}
              >
                {chainName.charAt(0).toUpperCase() + chainName.slice(1)}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </CardContent>
      {selected?.authorization ? (
        <AuthorizationInfo
          authorization={selected}
          displayDenom={currency?.coinDenom}
          open={infoOpen}
          onClose={handleInfoClose}
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
          {!chainGrantsByMe?.grants.length ? (
            <Typography
              variant="h6"
              color="text.primary"
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 2,
              }}
            >
              No Authz found
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
                    <StyledTableCell>Message</StyledTableCell>
                    <StyledTableCell>Expiration</StyledTableCell>
                    <StyledTableCell>Details</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {chainGrantsByMe.grants.map((row, index) => (
                    <StyledTableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <StyledTableCell component="th" scope="row">
                        <Stack direction="row">
                          {shortenAddress(row.grantee, 21)}
                          <CopyToClipboard
                            message={row.grantee}
                            toolTipEnabled={true}
                          />
                        </Stack>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={getTypeURLName(row.authorization["@type"])}
                          variant="filled"
                          size="medium"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={getMsgNameFromAuthz(row.authorization)}
                          variant="filled"
                          size="medium"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.expiration ? (
                          getLocalTime(row.expiration)
                        ) : (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: "&infin;",
                            }}
                          />
                        )}
                      </StyledTableCell>
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
                          disabled={authzTx?.status === "pending"}
                          onClick={() => revoke(row, index)}
                        >
                          {authzTx.status === "pending" &&
                          index === selectedRevoke ? (
                            <>
                              <CircularProgress size={18} />
                              &nbsp;&nbsp;Please wait...
                            </>
                          ) : (
                            <>Revoke</>
                          )}
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
          {!chainGrantsToMe?.grants?.length ? (
            <Typography
              variant="h6"
              color="text.primary"
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 16,
              }}
            >
              No Authz found
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
                    <StyledTableCell>Message</StyledTableCell>
                    <StyledTableCell>Expiration</StyledTableCell>
                    <StyledTableCell>Details</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {chainGrantsToMe.grants.map((row, index) => (
                    <StyledTableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <StyledTableCell component="th" scope="row">
                        <Stack direction="row">
                          {shortenAddress(row.granter, 21)}
                          <CopyToClipboard
                            message={row.granter}
                            toolTipEnabled={true}
                          />
                        </Stack>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={getTypeURLName(row.authorization["@type"])}
                          variant="filled"
                          size="medium"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={getMsgNameFromAuthz(row.authorization)}
                          variant="filled"
                          size="medium"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.expiration ? (
                          getLocalTime(row.expiration)
                        ) : (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: "&infin;",
                            }}
                          />
                        )}
                      </StyledTableCell>
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
