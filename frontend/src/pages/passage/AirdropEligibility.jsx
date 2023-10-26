import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import {
  getClaimRecords,
  resetState,
  getClaimParams,
  txClaimAction,
  resetClaimRecords,
  getAirdropDetails,
} from "../../features/airdrop/airdropSlice";
import { useNavigate, useParams } from "react-router-dom";
import { resetError, setError } from "../../features/common/commonSlice";
import AirdropProgress from "../../components/passage/AirdropProgress";
import { fromBech32, toHex, toBech32, fromHex } from "@cosmjs/encoding";
import AlertTitle from "@mui/material/AlertTitle";
import CustomizedDialogs from "../../components/passage/disclaimer";
import "./../common.css";
import { networks } from "../../utils/chainsInfo";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";

function getPasgNetwork(pathParams) {
  for (let i = 0; i < networks.length; i++) {
    const network = networks[i];
    if (
      network.config.currencies[0].coinMinimalDenom === "upasg" &&
      network?.config?.chainName.toLowerCase() === pathParams?.networkName
    ) {
      return network;
    }
  }

  return null;
}

function getClaimPercentage(claimRecords) {
  const actions = claimRecords?.action_completed;
  let claimed = 0;
  for (let action of actions) {
    if (action === true) {
      claimed++;
    }
  }

  return Math.floor((claimed / (actions.length + 1.5)) * 100);
}

function getPassageAddress(address) {
  try {
    const hexAddress = toHex(fromBech32(address).data);
    return [toBech32("pasg", fromHex(hexAddress)), null];
  } catch (err) {
    return [null, err.message];
  }
}

export default function AirdropEligibility() {
  const defaultChainID = "passage-2";

  const pathParams = useParams();
  const claimRecords = useSelector((state) => state.airdrop.claimRecords);
  const params = useSelector((state) => state.airdrop.params);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const [chainInfo, _] = useState(getPasgNetwork(pathParams));
  const status = useSelector((state) => state.airdrop.claimStatus);
  const errMsg = useSelector((state) => state.airdrop.errMsg);
  const txStatus = useSelector((state) => state.airdrop.tx.status);
  const detailsStatus = useSelector(
    (state) => state.airdrop.airdropDetailsStatus
  );
  const airdropDetails = useSelector((state) => state.airdrop.airdropDetails);
  const walletAddress = useSelector(
    (state) =>
      state.wallet.networks?.[nameToChainIDs[pathParams?.networkName]]
        ?.walletInfo?.bech32Address
  );
  const currency = chainInfo.config.currencies[0];

  const airdropActions = [{ title: "#1 Initial Claim", type: "action" }];

  const { handleSubmit, control, setValue, getValues } = useForm({
    defaultValues: {
      address: "",
    },
  });

  let navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }

  const handleGOTOStaking = () => {
    navigate(`/${pathParams?.networkName}/staking`);
  };

  useEffect(() => {
    if (chainInfo.showAirdrop) {
      dispatch(resetError());
      if (chainInfo.config.rest !== "") {
        dispatch(
          getClaimParams({
            baseURL: chainInfo.config.rest,
          })
        );
      }
      return () => {
        dispatch(resetError());
        dispatch(resetState());
      };
    }
  }, []);

  useEffect(() => {
    if (txStatus === "idle") {
      if (walletAddress?.length > 0)
        dispatch(
          getClaimRecords({
            baseURL: chainInfo.config.rest,
            address: walletAddress,
          })
        );
    }
  }, [txStatus]);

  useEffect(() => {
    if (walletAddress?.startsWith("pasg")) {
      dispatch(resetState());
      setValue("address", walletAddress);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (errMsg !== "" && status === "rejected") {
      dispatch(
        setError({
          type: "error",
          message: errMsg,
        })
      );
    }
  }, [errMsg]);

  const dispatch = useDispatch();
  const onSubmit = (data) => {
    const [address, err] = getPassageAddress(data.address);
    if (err) {
      dispatch(
        setError({
          type: "error",
          message: err,
        })
      );
    } else {
      dispatch(resetClaimRecords());
      dispatch(
        getClaimRecords({
          baseURL: chainInfo.config.rest,
          address: address,
        })
      );
      dispatch(
        getAirdropDetails({
          address: address,
        })
      );
    }
  };

  const getClaimableAmount = (records) => {
    let total = 0.0;
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      total += parseFloat(record.amount / 10.0 ** currency.coinDecimals);
    }

    return `${parseFloat(total.toFixed(6))?.toLocaleString()} ${
      currency.coinDenom
    }`;
  };

  const calculateBonus = (records) => {
    let total = 0.0;
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      total += parseFloat(record.amount / 10.0 ** currency.coinDecimals);
    }

    const bonus = total + total / 2.0;

    return `${parseFloat(bonus.toFixed(6))?.toLocaleString()} ${
      currency.coinDenom
    }`;
  };

  const txAction1 = () => {
    if (walletAddress.length > 0) {
      dispatch(
        txClaimAction({
          address: walletAddress,
          denom: currency.coinMinimalDenom,
          chainId: chainInfo.config.chainId,
          rpc: chainInfo.config.rpc,
          feeAmount:
            chainInfo.config.feeCurrencies[0].gasPriceStep.average *
            10 ** currency.coinDecimals,
          baseURL: chainInfo.config.rest,
          memo: "I agree to the passage airdrop terms and conditions",
        })
      );
    } else {
      alert("Wallet is not connected");
    }
  };

  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const handleDisclaimerClose = () => {
    setDisclaimerOpen(false);
  };

  return (
    <>
      <CustomizedDialogs
        open={disclaimerOpen}
        handleClose={handleDisclaimerClose}
      />
      <br />
      <Grid container>
        <Grid item xs={1} md={2}></Grid>
        <Grid item xs={10} md={8}>
          <Paper elevation={0} style={{ padding: 24 }}>
            <Typography variant="h5" color="text.primary" fontWeight={700}>
              Passage Airdrop
            </Typography>
            <br />
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="address"
                control={control}
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter cosmos/juno address"
                    required
                    label="Address"
                    fullWidth
                  />
                )}
              />
              <br />
              <br />
              <Button
                type="submit"
                variant="outlined"
                disableElevation
                disabled={status === "pending"}
                size="medium"
              >
                {status === "pending" ? (
                  <CircularProgress size={25} />
                ) : (
                  `Check Airdrop`
                )}
              </Button>
            </form>
            <div style={{ marginTop: 16 }}>
              {status === "idle" ? (
                claimRecords.address?.length > 0 ? (
                  <>
                    <Alert style={{ textAlign: "left" }} severity="success">
                      <AlertTitle>
                        Total tokens claimable:&nbsp;&nbsp;&nbsp;
                        {calculateBonus(claimRecords?.claimable_amount)}
                        <br />
                        Initial tokens claimable:&nbsp;&nbsp;
                        {getClaimableAmount(claimRecords?.claimable_amount)}
                      </AlertTitle>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                      >
                        66.7% available for initial claim with 33.3% (or +50% of
                        the initial claim) receivable if the tokens are staked
                        continuously until 14 months from genesis. The airdrop
                        needs to be staked within 3 weeks of airdrop start.
                      </Typography>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                        >
                          See more information on&nbsp;&nbsp;
                        </Typography>
                        <Link
                          variant="body1"
                          href="https://medium.com/@passage3D"
                          target="_blank"
                        >
                          medium.com/passage3d
                        </Link>
                      </div>
                      <Typography variant="body1" color="text.primary">
                        Claim will be available shortly after the public token
                        sale. You can then go to the bottom of the page to
                        claim.
                      </Typography>
                    </Alert>

                    {detailsStatus === "fulfilled" ? (
                      <Box
                        sx={{
                          mt: 4,
                          textAlign: "left",
                        }}
                      >
                        <Typography
                          variant="title1"
                          fontWeight={600}
                          gutterBottom
                        >
                          Airdrop breakdown
                        </Typography>
                        <TableContainer
                          component={Paper}
                          elevation={0}
                          sx={{
                            mt: 1,
                          }}
                        >
                          <Table size="small">
                            <TableHead>
                              <StyledTableRow>
                                <StyledTableCell
                                  sx={{
                                    fontWeight: 600,
                                    color: "text.primary",
                                  }}
                                >
                                  Airdrop Category
                                </StyledTableCell>
                                <StyledTableCell
                                  sx={{
                                    fontWeight: 600,
                                    color: "text.primary",
                                  }}
                                >
                                  No. of NFTs
                                </StyledTableCell>
                                <StyledTableCell
                                  sx={{
                                    fontWeight: 600,
                                    color: "text.primary",
                                  }}
                                >
                                  Total Airdrop
                                </StyledTableCell>
                              </StyledTableRow>
                            </TableHead>
                            <TableBody>
                              <StyledTableRow>
                                <StyledTableCell>
                                  Town&nbsp;1&nbsp;
                                </StyledTableCell>
                                <StyledTableCell>
                                  {airdropDetails?.town1_nfts}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {(
                                    parseFloat(airdropDetails?.town1_amount) /
                                    10 ** 6
                                  ).toLocaleString() || 0}
                                  &nbsp; PASG
                                </StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow>
                                <StyledTableCell>
                                  Town&nbsp;2&nbsp;
                                </StyledTableCell>
                                <StyledTableCell>
                                  {airdropDetails?.town2_nfts}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {(
                                    parseFloat(airdropDetails?.town2_amount) /
                                    10 ** 6
                                  ).toLocaleString() || 0}
                                  &nbsp; PASG
                                </StyledTableCell>
                              </StyledTableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    ) : null}
                  </>
                ) : (
                  <Alert style={{ textAlign: "left" }} severity="error">
                    <AlertTitle>Sorry</AlertTitle>
                    You are not eligible for the Airdrop
                  </Alert>
                )
              ) : (
                <></>
              )}
            </div>
          </Paper>
        </Grid>
        <Grid item xs={1} md={2}></Grid>
      </Grid>
      {claimRecords?.address && airdropActions?.length > 0 ? (
        <Alert severity="info" style={{ textAlign: "left", marginTop: 8 }}>
          <AlertTitle>
            <Typography variant="body1" fontWeight={500}>
              Legal Disclaimer
            </Typography>
          </AlertTitle>
          <Typography gutterBottom variant="body2">
            By claiming these tokens, you confirm that you are not a U.S. person
            or claiming the tokens for the account or benefit of a U.S. person.
          </Typography>
          <Typography gutterBottom variant="body2">
            The Passage platform is a smart contract based suite of technologies
            that relies on blockchain technology. By using this product in any
            capacity, you recognize and assume all risks inherent in such
            technologies, including but not limited to the risk that the smart
            contracts underlying our product could fail, resulting in a total
            loss of user funds. Passage is not responsible for any such losses.
          </Typography>
          <Typography gutterBottom variant="body2">
            Mentions of potential exchange listings are hypothetical and there
            is no guarantee that they will happen. All investments involve risk,
            and the forecasted performance of a security, utility token,
            financial product or individual investment does not guarantee actual
            results or returns. Investors are solely responsible for any
            investment decision that they make. Such decisions should be based
            solely on an evaluation of their financial circumstances, investment
            objectives, risk tolerance, and liquidity needs. We are not
            financial advisors or a registered broker dealer and bear no
            responsibility for any losses you may incur as a result of your
            decision to invest.
          </Typography>
        </Alert>
      ) : (
        <></>
      )}
      {walletAddress?.length > 0 ? (
        claimRecords?.address === getValues().address &&
        airdropActions?.length > 0 ? (
          <>
            <br />
            <Paper style={{ padding: 16, textAlign: "left" }} elevation={0}>
              <Typography
                variant="h6"
                color="text.primary"
                style={{ marginBottom: 12 }}
              >
                My Progress
              </Typography>
              <AirdropProgress value={getClaimPercentage(claimRecords)} />
            </Paper>
            <br />
            <Paper elevation={0} style={{ padding: 16, textAlign: "left" }}>
              <Typography color="text.primary" variant="h5" fontWeight={600}>
                Missions
              </Typography>
              {airdropActions.map((item, index) =>
                item.type === "action" ? (
                  <Paper key={index} elevation={1} className="claim-item">
                    <Typography
                      color="text.primary"
                      variant="body1"
                      fontWeight={600}
                    >
                      {item.title}
                    </Typography>
                    <Button
                      variant="contained"
                      disableElevation
                      onClick={() => {
                        txAction1();
                      }}
                      disabled={
                        params?.airdrop_enabled === false ||
                        (params?.airdrop_enabled === false &&
                          new Date(params?.airdrop_start_time) >= new Date()) ||
                        (claimRecords?.action_completed.length >= index &&
                          claimRecords?.action_completed[index] === true) ||
                        txStatus === "pending"
                      }
                    >
                      {claimRecords?.action_completed.length >= index &&
                      claimRecords?.action_completed[index] === true ? (
                        `Claimed`
                      ) : txStatus === "pending" ? (
                        <CircularProgress size={25} />
                      ) : (
                        `Claim`
                      )}
                    </Button>
                  </Paper>
                ) : (
                  <Paper elevation={1} className="claim-item">
                    <Typography
                      color="text.primary"
                      variant="h6"
                      fontWeight={600}
                    >
                      {item.title}
                    </Typography>
                    <Button
                      variant="contained"
                      disableElevation
                      onClick={() => {
                        navigateTo(item.redirect);
                      }}
                      disabled={
                        claimRecords?.action_completed.length >= index &&
                        claimRecords?.action_completed[index] === true
                      }
                    >
                      {claimRecords?.action_completed.length >= index &&
                      claimRecords?.action_completed[index] === true
                        ? `Claimed`
                        : `Claim`}
                    </Button>
                  </Paper>
                )
              )}
              <Paper elevation={1} className="claim-item">
                <Box>
                  <Typography
                    color="text.primary"
                    variant="body1"
                    fontWeight={600}
                    gutterBottom
                  >
                    #2 Stake your initial airdrop until 14 months from genesis
                    and recieve +50% of your initial token claim
                  </Typography>
                  <Link
                    onClick={handleGOTOStaking}
                    variant="body1"
                    sx={{
                      justifyContent: "center",
                      display: "flex",
                      cursor: "pointer",
                    }}
                  >
                    Click here to stake
                  </Link>
                </Box>
                <Button variant="contained" disableElevation disabled>
                  Automated
                </Button>
              </Paper>
            </Paper>
          </>
        ) : (
          <></>
        )
      ) : claimRecords?.action_completed?.length > 0 ? (
        <Typography
          variant="h5"
          color="text.primary"
          fontWeight={800}
          style={{ marginTop: 36 }}
        >
          Connect Keplr/Leap wallet to claim airdrop
        </Typography>
      ) : (
        <></>
      )}
    </>
  );
}
