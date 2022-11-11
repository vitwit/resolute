import * as React from "react";
import { useEffect } from "react";
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
} from "./../../features/feegrant/feegrantSlice";
import {
  resetError,
  resetTxHash,
  setError,
} from "./../../features/common/commonSlice";
import Chip from "@mui/material/Chip";
import { getTypeURLName, shortenAddress } from "./../../utils/util";
import { getLocalTime } from "./../../utils/datetime";
import { useNavigate } from "react-router-dom";
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
  removeFeegrant,
  setFeegrant,
} from "../../utils/localStorage";

export default function Feegrant() {
  const [tab, setTab] = React.useState(0);
  const grantsToMe = useSelector((state) => state.feegrant.grantsToMe);
  const grantsByMe = useSelector((state) => state.feegrant.grantsByMe);
  const dispatch = useDispatch();

  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const address = useSelector((state) => state.wallet.address);
  const errState = useSelector((state) => state.feegrant.errState);
  const txStatus = useSelector((state) => state.feegrant.tx);
  const currency = useSelector(
    (state) => state.wallet.chainInfo.config.currencies[0]
  );
  const [infoOpen, setInfoOpen] = React.useState(false);
  const isNanoLedger = useSelector((state) => state.wallet.isNanoLedger);

  const [selected, setSelected] = React.useState({});
  const handleInfoClose = (value) => {
    setInfoOpen(false);
  };

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
  }, [address]);

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
    const grant = getFeegrant();
    if (grant) {
      return row?.granter === grant?.granter;
    }
    return false;
  };

  return (
    <>
      {selected?.allowance ? (
        <FeegrantInfo
          authorization={selected}
          displayDenom={currency?.coinDenom}
          open={infoOpen}
          onClose={handleInfoClose}
        />
      ) : (
        <></>
      )}
      <Box
        sx={{
          mb: 1,
          mt: 3,
          textAlign: "right",
        }}
      >
        <Button
          variant="contained"
          disableElevation
          sx={{
            textTransform: "none",
          }}
          onClick={() => navigateTo("/feegrant/new")}
        >
          Grant New
        </Button>
      </Box>
      <Paper elevation={0} sx={{ p: 1, mt: 2 }}>
        <GroupTab
          tabs={["Granted By Me", "Granted To Me"]}
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
                            {row?.allowance?.expiration ? (
                              getLocalTime(row?.allowance?.expiration)
                            ) : (
                              <span
                                dangerouslySetInnerHTML={{ __html: "&infin;" }}
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
                            {row.allowance.expiration ? (
                              getLocalTime(row.allowance.expiration)
                            ) : (
                              <span
                                dangerouslySetInnerHTML={{ __html: "&infin;" }}
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
                          {/* <StyledTableCell>
                                  <Switch checked={useFeeChecked}
                                    onChange={(e) => handleOnFeeChecked(e, row)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    size="small" />

                                </StyledTableCell> */}
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
                                        setFeegrant(row);
                                      } else {
                                        removeFeegrant();
                                      }
                                    }
                                  }}
                                  defaultChecked={isUsingFeeGrant(row)}
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
    </>
  );
}
