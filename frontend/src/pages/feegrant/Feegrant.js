import * as React from "react";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useSelector, useDispatch } from "react-redux";
import {
  getGrantsToMe,
  getGrantsByMe,
  txRevoke,
  resetAlerts,
  getAuthzGrants,
  resetAuthzGrants,
} from "./../../features/feegrant/feegrantSlice";
import { getGrantsToMe as getAuthzGrantsToMe } from "../../features/authz/authzSlice";
import {
  resetError,
  resetTxHash,
  setError,
  setFeegrant as setFeegrantState,
  resetFeegrant,
  removeFeegrant as removeFeegrantState,
} from "./../../features/common/commonSlice";
import Chip from "@mui/material/Chip";
import { getTypeURLName, shortenAddress } from "./../../utils/util";
import { getLocalTime } from "./../../utils/datetime";
import { useNavigate, useParams } from "react-router-dom";
import {
  StyledTableCell,
  StyledTableRow,
} from "./../../components/CustomTable";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { FeegrantInfo } from "./../../components/FeegrantInfo";
import GroupTab, { TabPanel } from "../../components/group/GroupTab";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Box } from "@mui/material";
import {
  getFeegrant,
  setFeegrant,
  removeFeegrant as removeFeegrantLocalState,
} from "../../utils/localStorage";
import SelectNetwork from "../../components/common/SelectNetwork";
import FeegranterInfo from "../../components/FeegranterInfo";

const renderExpiration = (row) => {
  switch (row?.allowance["@type"]) {
    case "/cosmos.feegrant.v1beta1.BasicAllowance":
      return (
        <>
          {row?.allowance?.expiration ? (
            getLocalTime(row?.allowance?.expiration)
          ) : (
            <span
              dangerouslySetInnerHTML={{
                __html: "&infin;",
              }}
            />
          )}
        </>
      );

    case "/cosmos.feegrant.v1beta1.PeriodicAllowance":
      return (
        <>
          {row?.allowance?.basic?.expiration ? (
            getLocalTime(row?.allowance?.basic?.expiration)
          ) : (
            <span
              dangerouslySetInnerHTML={{
                __html: "&infin;",
              }}
            />
          )}
        </>
      );

    default:
      return (
        <>
          {row?.allowance?.allowance?.basic?.expiration ? (
            getLocalTime(row?.allowance?.allowance?.basic?.expiration)
          ) : (
            <span
              dangerouslySetInnerHTML={{
                __html: "&infin;",
              }}
            />
          )}
        </>
      );
  }
};

export const filterAuthzFeegrant = (grantsToMe) => {
  const granters = [];
  const grants = grantsToMe?.grants || [];
  for (const grant of grants) {
    const authorizationType = grant?.authorization["@type"];
    const isGenericAuthorization =
      authorizationType === "/cosmos.authz.v1beta1.GenericAuthorization";
    const isMsgGrantAllowance =
      grant?.authorization.msg === "/cosmos.feegrant.v1beta1.MsgRevokeAllowance";
    if (isGenericAuthorization && isMsgGrantAllowance) {
      granters.push(grant.granter);
    }
  }
  return granters;
};

export default function Feegrant() {
  const [tab, setTab] = useState(0);
  const [currentGranter, setCurrentGranter] = useState(null);
  const [usingFeegrant, setUsingFeegrant] = useState();

  const grantsToMe = useSelector((state) => state.feegrant.grantsToMe);
  const grantsByMe = useSelector((state) => state.feegrant.grantsByMe);

  const dispatch = useDispatch();

  const params = useParams();

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const networks = useSelector((state) => state.wallet.networks);
  const [currentNetwork, setCurrentNetwork] = React.useState(
    params?.networkName || selectedNetwork.toLowerCase()
  );

  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const chainID = nameToChainIDs[currentNetwork];
  const chainInfo = networks[chainID]?.network;
  const address = networks[chainID]?.walletInfo.bech32Address;

  const authzFeegrants = useSelector((state) => state.feegrant.authzGrants);
  const authzGrantsToMe = useSelector(
    (state) => state.authz.grantsToMe?.[chainID]
  );
  const isAuthzMode = useSelector((state) => state.common.authzMode);
  const feegrant = useSelector(
    (state) => state.common.feegrant?.[currentNetwork]
  );
  const errState = useSelector((state) => state.feegrant.errState);
  const txStatus = useSelector((state) => state.feegrant.tx);
  const currency = chainInfo?.config?.currencies[0];
  const [infoOpen, setInfoOpen] = React.useState(false);
  const isNanoLedger = useSelector((state) => state.wallet.isNanoLedger);

  const [selected, setSelected] = React.useState({});
  const [isNoAuthzs, setNoAuthzs] = useState(false);
  const [authzGrants, setAuthzGrants] = useState();

  const handleInfoClose = (value) => {
    setInfoOpen(false);
  };

  useEffect(() => {
    const currentChainGrants = getFeegrant()?.[currentNetwork];
    dispatch(
      setFeegrantState({
        grants: currentChainGrants,
        chainName: currentNetwork.toLowerCase(),
      })
    );
  }, [currentNetwork, params]);

  useEffect(() => {
    if (params?.networkName?.length > 0) setCurrentNetwork(params.networkName);
    else setCurrentNetwork("cosmoshub");
  }, [params]);

  useEffect(() => {
    if (address && address.length > 0) {
      dispatch(
        getGrantsByMe({
          baseURL: chainInfo.config.rest,
          granter: address,
        })
      );
      dispatch(
        getGrantsToMe({
          baseURL: chainInfo.config.rest,
          grantee: address,
        })
      );
    }
  }, [chainInfo, currentNetwork, address]);

  const selectedAuthz = useSelector((state) => state.authz.selected);
  useEffect(() => {
    if (selectedAuthz.granter.length > 0) {
      dispatch(
        setError({
          type: "error",
          message: "Not supported in Authz mode",
        })
      );
      setTimeout(() => {
        navigateTo("/");
      }, 1000);
    }
    return () => {
      dispatch(resetAlerts());
      dispatch(resetError());
      dispatch(resetTxHash());
    };
  }, []);

  useEffect(() => {
    if (grantsToMe?.errMsg !== "" && grantsToMe?.status === "rejected") {
      dispatch(
        setError({
          type: "error",
          message: grantsToMe.errMsg,
        })
      );
    }
  }, [grantsToMe]);

  useEffect(() => {
    if (grantsByMe?.errMsg !== "" && grantsByMe?.status === "rejected") {
      dispatch(
        setError({
          type: "error",
          message: grantsByMe.errMsg,
        })
      );
    }
  }, [grantsByMe]);

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

  let navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }

  useEffect(() => {
    if (errState.message !== "" && errState.type === "error") {
      dispatch(setError(errState));
    }
  }, [errState]);

  const handleTabChange = (value) => {
    setTab(value);
  };

  const isUsingFeeGrant = (row) => {
    const grant = getFeegrant()?.[currentNetwork];
    if (grant) {
      return row?.granter === grant?.granter;
    }
    return false;
  };

  const handleCheck = (index, row) => {
    setCurrentGranter(index);
    if (!index) {
      setUsingFeegrant(isUsingFeeGrant(row));
    }
  };

  useEffect(() => {
    const currentChainGrants = getFeegrant()?.[currentNetwork];
    dispatch(
      setFeegrantState({
        grants: currentChainGrants,
        chainName: currentNetwork.toLowerCase(),
      })
    );
  }, [currentNetwork, params]);

  const removeFeegrant = () => {
    // Should we completely remove feegrant or only for this session.
    dispatch(removeFeegrantState(currentNetwork));
    removeFeegrantLocalState(currentNetwork);
  };

  useEffect(() => {
    if (isAuthzMode) {
      for (let granter in authzGrants) {
        dispatch(
          getAuthzGrants({
            baseURL: chainInfo.config.rest,
            granter: authzGrants[granter],
          })
        );
      }
    }
  }, [isAuthzMode, authzGrants, address]);

  useEffect(() => {
    if (chainID?.length && address?.length) {
      dispatch(
        getAuthzGrantsToMe({
          baseURL: chainInfo?.config?.rest,
          grantee: address,
          chainID: chainID,
        })
      );
    }
  }, [chainInfo, address]);

  useEffect(() => {
    const result = filterAuthzFeegrant(authzGrantsToMe) || [];
    if (result?.length === 0) {
      setNoAuthzs(true);
      setAuthzGrants([]);
      dispatch(resetAuthzGrants());
    } else {
      setNoAuthzs(false);
      setAuthzGrants(result);
    }
  }, [authzGrantsToMe, address]);

  return (
    <>
      {feegrant?.granter?.length > 0 ? (
        <FeegranterInfo
          feegrant={feegrant}
          onRemove={() => {
            removeFeegrant();
          }}
        />
      ) : null}
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <SelectNetwork
          onSelect={(name) => {
            navigate(`/${name}/feegrant`);
          }}
          networks={Object.keys(nameToChainIDs)}
          defaultNetwork={currentNetwork.toLowerCase().replace(/ /g, "")}
        />
      </Box>
      <Box
        sx={{
          mb: 1,
          mt: 2,
          textAlign: "right",
        }}
      >
        <Button
          variant="contained"
          disableElevation
          sx={{
            textTransform: "none",
          }}
          onClick={() => navigateTo(`/${currentNetwork}/feegrant/new`)}
        >
          Grant New
        </Button>
      </Box>
      {!isAuthzMode ? (
        <Paper elevation={0} sx={{ p: 1, mt: 2 }}>
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
              {grantsByMe && grantsByMe?.grants.length === 0 ? (
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
                      {grantsByMe &&
                        grantsByMe?.grants?.map((row, index) => (
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
                            <StyledTableCell>
                              {renderExpiration(row)}
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
              {grantsToMe && grantsToMe.grants?.length === 0 ? (
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
                        <StyledTableCell>Use Feegrant</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {grantsToMe &&
                        grantsToMe.grants?.map((row, index) => (
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
                            <StyledTableCell>
                              {renderExpiration(row)}
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
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={(e) => {
                                      if (isNanoLedger) {
                                        dispatch(
                                          setError({
                                            type: "info",
                                            message:
                                              "Feegrant does not support ledger signing",
                                          })
                                        );
                                      } else {
                                        if (e.target.checked) {
                                          setFeegrant(row, currentNetwork);
                                          dispatch(
                                            setFeegrantState({
                                              grants: row,
                                              chainName: currentNetwork,
                                            })
                                          );
                                          handleCheck(index, row);
                                        } else {
                                          dispatch(
                                            removeFeegrantState(currentNetwork)
                                          );
                                          removeFeegrant(currentNetwork);
                                          handleCheck(null, row);
                                        }
                                      }
                                    }}
                                    checked={
                                      isUsingFeeGrant(row) ||
                                      index === currentGranter
                                    }
                                    defaultChecked={usingFeegrant}
                                  />
                                }
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </>
          </TabPanel>
        </Paper>
      ) : (
        <>
          {!authzFeegrants
            ? null
            : Object.keys(authzFeegrants).map((item) => (
                <>
                  <Table
                    sx={{ minWidth: 650 }}
                    aria-label="simple table"
                    size="small"
                  >
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>Granter</StyledTableCell>
                        <StyledTableCell>Grantee</StyledTableCell>
                        <StyledTableCell>Type</StyledTableCell>
                        <StyledTableCell>Expiration</StyledTableCell>
                        <StyledTableCell>Details</StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {authzFeegrants?.[item] &&
                        authzFeegrants?.[item]?.grants?.map((row, index) => (
                          <StyledTableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <StyledTableCell component="th" scope="row">
                              {shortenAddress(item, 21)}
                            </StyledTableCell>
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
                            <StyledTableCell>
                              {renderExpiration(row)}
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
              ))}
        </>
      )}
    </>
  );
}
