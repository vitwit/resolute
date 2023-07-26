import * as React from "react";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  getGrantsToMe,
  getGrantsByMe,
  txAuthzRevoke,
  authzExecHelper,
  setSelectedGranter,
  resetTxAuthzRes,
} from "../../features/authz/authzSlice";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import { getTypeURLName, shortenAddress } from "../../utils/util";
import { useNavigate, useParams } from "react-router-dom";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { getLocalTime } from "../../utils/datetime";
import { AuthorizationInfo } from "../../components/AuthorizationInfo";
import {
  resetError,
  resetFeegrant,
  resetTxHash,
  setError,
  removeFeegrant as removeFeegrantState,
  setFeegrant as setFeegrantState,
  getICNSName,
} from "../../features/common/commonSlice";
import {
  getMsgNameFromAuthz,
  getTypeURLFromAuthorization,
} from "../../utils/authorizations";
import { AuthzSendDialog } from "../../components/authz/AuthzSend";
import FeegranterInfo from "../../components/FeegranterInfo";
import SelectNetwork from "../../components/common/SelectNetwork";
import {
  getFeegrant,
  removeFeegrant as removeFeegrantLocalState,
} from "../../utils/localStorage";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import { copyToClipboard } from "../../utils/clipboard";
import NameAddress from "../../components/common/NameAddress";

export default function Authz() {
  const dispatch = useDispatch();

  const [infoOpen, setInfoOpen] = React.useState(false);
  const [selected, setSelected] = React.useState({});

  const params = useParams();

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const networks = useSelector((state) => state.wallet.networks);
  const [currentNetwork, setCurrentNetwork] = React.useState(
    params?.networkName || selectedNetwork.toLowerCase()
  );

  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const chainInfo = networks[nameToChainIDs[currentNetwork]]?.network;
  const address =
    networks[nameToChainIDs[currentNetwork]]?.walletInfo.bech32Address;
  const chainID = nameToChainIDs?.[currentNetwork];

  const grantsByMe = useSelector((state) => state.authz.grantsByMe?.[chainID]);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe?.[chainID]);
  const txAuthzRes = useSelector((state) => state.authz.txAuthzRes);
  const icnsNames = useSelector((state) => state.common.icnsNames);

  const handleInfoClose = (value) => {
    setInfoOpen(false);
  };

  const [grantType, setGrantType] = React.useState("by-me");

  const authzTx = useSelector((state) => state.authz.tx);
  const execTx = useSelector((state) => state.authz.execTx);
  const currency =
    networks[nameToChainIDs[currentNetwork]]?.network.config.currencies[0];

  const feegrant = useSelector(
    (state) => state.common.feegrant?.[currentNetwork]
  );

  useEffect(() => {
    if (execTx.status === "idle") {
      setSelectedGrant({});
    }
  }, [execTx]);

  const removeFeegrant = () => {
    // Should we completely remove feegrant or only for this session.
    dispatch(removeFeegrantState(currentNetwork));
    removeFeegrantLocalState(currentNetwork);
  };

  useEffect(() => {
    if (params?.networkName?.length > 0) setCurrentNetwork(params.networkName);
    else setCurrentNetwork("cosmoshub");
  }, [params]);

  useEffect(() => {
    dispatch(resetTxAuthzRes());
  }, []);

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
    if (address !== "" || txAuthzRes?.status === "idle") {
      dispatch(
        getGrantsByMe({
          baseURL: chainInfo?.config?.rest,
          granter: address,
          chainID: chainInfo?.config?.chainId,
        })
      );
    }
  }, [chainInfo, txAuthzRes?.status]);

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

  const onRevoke = (granter, grantee, typeURL) => {
    dispatch(
      txAuthzRevoke({
        granter: granter,
        baseURL: chainInfo.config.rest,
        grantee: grantee,
        typeURL: typeURL,
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average *
          10 ** currency.coinDecimals,
        feegranter: feegrant?.granter,
      })
    );
  };

  let navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }

  const [selectedGrant, setSelectedGrant] = React.useState({});
  const onUseAuthz = (row) => {
    dispatch(
      setSelectedGranter({
        granter: row.granter,
      })
    );
    setTimeout(() => {
      navigateTo("/");
    }, 200);
  };

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
      dispatch(resetError());
      dispatch(resetTxHash());
    };
  }, []);

  const onExecSend = (data) => {
    authzExecHelper(dispatch, {
      type: "send",
      from: address,
      granter: data.from,
      recipient: data.recipient,
      amount: data.amount,
      denom: currency.coinMinimalDenom,
      chainId: chainInfo.config.chainId,
      rest: chainInfo.config.rest,
      aminoConfig: chainInfo.aminoConfig,
      prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
      feeAmount:
        chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average *
        10 ** currency.coinDecimals,
      feegranter: feegrant?.granter,
    });
  };

  const fetchName = (address) => {
    if (!icnsNames?.[address]) {
      dispatch(
        getICNSName({
          address: address,
        })
      );
    }
    return icnsNames?.[address]?.name;
  };

  return (
    <>
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
            navigate(`/${name}/authz`);
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
          size="medium"
          onClick={() => navigateTo(`/${currentNetwork}/authz/new`)}
          disableElevation
          sx={{
            textTransform: "none",
          }}
        >
          Grant New
        </Button>
      </Box>
      <Paper
        elevation={0}
        sx={{
          p: 2,
        }}
      >
        <ButtonGroup
          variant="outlined"
          aria-label="validators"
          sx={{ display: "flex", mb: 1 }}
          disableElevation
        >
          <Button
            variant={grantType === "by-me" ? "contained" : "outlined"}
            onClick={() => {
              dispatch(
                getGrantsByMe({
                  baseURL: chainInfo?.config?.rest,
                  granter: address,
                  chainID: chainInfo?.config?.chainId,
                })
              );
              setGrantType("by-me");
            }}
          >
            Granted by me
          </Button>
          <Button
            variant={grantType === "to-me" ? "contained" : "outlined"}
            onClick={() => {
              dispatch(
                getGrantsToMe({
                  baseURL: chainInfo?.config?.rest,
                  grantee: address,
                  chainID: chainInfo?.config?.chainId,
                })
              );
              setGrantType("to-me");
            }}
          >
            Granted to me
          </Button>
        </ButtonGroup>

        <TableContainer component={Paper} elevation={0}>
          {grantType === "by-me" ? (
            <>
              {grantsByMe?.grants?.length === 0 ? (
                <Typography
                  variant="h6"
                  color="text.primary"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 16,
                  }}
                >
                  No Authorizations Found
                </Typography>
              ) : (
                <>
                  <Table
                    sx={{ minWidth: 700 }}
                    size="small"
                    aria-label="simple table"
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
                      {grantsByMe?.grants &&
                        grantsByMe?.grants.map((row, index) => (
                          <StyledTableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <StyledTableCell component="th" scope="row">
                              <Chip
                                label={
                                  <NameAddress
                                    address={row.grantee}
                                    name={fetchName(row.grantee)}
                                  />
                                }
                                size="small"
                                deleteIcon={<ContentCopyOutlined />}
                                onDelete={() => {
                                  copyToClipboard(row.grantee, dispatch);
                                }}
                              />
                            </StyledTableCell>
                            <StyledTableCell>
                              <Chip
                                label={getTypeURLName(
                                  row.authorization["@type"]
                                )}
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
                                variant="contained"
                                size="small"
                                disableElevation
                                color="primary"
                                disabled={
                                  authzTx?.status === "pending" ? true : false
                                }
                                onClick={() =>
                                  onRevoke(
                                    row.granter,
                                    row.grantee,
                                    getTypeURLFromAuthorization(
                                      row.authorization
                                    )
                                  )
                                }
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
          ) : (
            <>
              {grantsToMe?.grants?.length === 0 ? (
                <Typography
                  variant="h6"
                  color="text.primary"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 16,
                  }}
                >
                  No Authorizations Found
                </Typography>
              ) : (
                <>
                  <Table
                    sx={{ minWidth: 700 }}
                    size="small"
                    aria-label="simple table"
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
                      {grantsToMe?.grants &&
                        grantsToMe?.grants.map((row, index) => (
                          <StyledTableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <StyledTableCell component="th" scope="row">
                              <Chip
                                label={
                                  <NameAddress
                                    address={row.granter}
                                    name={fetchName(row.granter)}
                                  />
                                }
                                size="small"
                                deleteIcon={<ContentCopyOutlined />}
                                onDelete={() => {
                                  copyToClipboard(row.granter, dispatch);
                                }}
                              />
                            </StyledTableCell>
                            <StyledTableCell>
                              <Chip
                                label={getTypeURLName(
                                  row.authorization["@type"]
                                )}
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
          )}
        </TableContainer>
      </Paper>

      {selectedGrant?.authorization &&
      (selectedGrant?.authorization["@type"] ===
        "/cosmos.bank.v1beta1.SendAuthorization" ||
        selectedGrant?.authorization?.msg ===
          "/cosmos.bank.v1beta1.MsgSend") ? (
        <AuthzSendDialog
          grant={selectedGrant}
          currency={currency}
          open={
            selectedGrant?.authorization["@type"] ===
              "/cosmos.bank.v1beta1.SendAuthorization" ||
            selectedGrant?.authorization?.msg === "/cosmos.bank.v1beta1.MsgSend"
          }
          onClose={() => {
            setSelectedGrant({});
          }}
          onExecSend={(data) => onExecSend(data)}
          execTx={execTx.status}
        />
      ) : (
        <></>
      )}
    </>
  );
}
