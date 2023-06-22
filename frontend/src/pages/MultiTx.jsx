import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  Link,
} from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { parseSendMsgsFromContent } from "./group/utils";
import { useDispatch, useSelector } from "react-redux";
import { RenderSendMessage } from "./multisig/tx/PageCreateTx";
import { Pagination } from "@mui/material";
import { Divider } from "@mui/material";
import { multiTxns } from "../features/bank/bankSlice";
import { resetError, setError } from "../features/common/commonSlice";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";

const PER_PAGE = 5;
const SEND_TEMPLATE = "https://resolute.witval.com/_static/send.csv";

export default function MultiTx({ chainInfo, address }) {
  const params = useParams();

  const selectNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [currentNetwork, setCurrentNetwork] = React.useState(
    params?.networkName || selectNetwork.toLowerCase()
  );
  const currency = chainInfo?.config?.currencies[0];

  const feegrant = useSelector(
    (state) => state.common.feegrant?.[currentNetwork]
  );
  const submitTxStatus = useSelector((state) => state.bank.tx.status);

  const [slicedMsgs, setSlicedMsgs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [messages, setMessages] = useState([]);

  const onDeleteMsg = (index) => {
    const arr = messages.filter((_, i) => i !== index);
    setMessages(arr);
    setSlicedMsgs(
      arr?.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
    );
  };

  const dispatch = useDispatch();
  const [displayMemoField, setDisplayMemoField] = useState(false);
  const [memo, setMemo] = useState("");

  const onSubmitTxs = () => {
    if (messages.length === 0) {
      alert("no messages");
      return;
    }
    dispatch(
      multiTxns({
        msgs: messages,
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config.gasPriceStep.average * 10 ** currency.coinDecimals,
        feegranter: feegrant?.granter,
        memo: memo,
      })
    );
  };

  useEffect(() => {
    return () => {
      dispatch(resetError());
    };
  }, []);

  const onFileContents = (content) => {
    const [parsedTxns, error] = parseSendMsgsFromContent(
      address,
      "\n" + content
    );
    if (error) {
      dispatch(
        setError({
          type: "error",
          message: error,
        })
      );
    } else {
      console.log(parsedTxns);
      setMessages(parsedTxns);
      setSlicedMsgs(parsedTxns?.slice(0, PER_PAGE));
    }
  };

  return (
    <Box>
      <Box>
        <Typography
          color="text.primary"
          variant="h6"
          sx={{
            textAlign: "left",
            p: 1,
          }}
        >
          Send transactions
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item md={5} xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              minHeight: 300,
              borderRadius: 0,
            }}
          >
            <Button
              variant="contained"
              disableElevation
              aria-label="upload file"
              size="small"
              endIcon={<FileUploadOutlinedIcon />}
              sx={{
                mb: 2,
                mt: 2,
                ml: 1,
                textTransform: "none",
              }}
              onClick={() => {
                document.getElementById("multisig_file").click();
              }}
            >
              Upload
            </Button>
            <input
              id="multisig_file"
              accept="*.csv"
              hidden
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) {
                  return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                  const contents = e.target.result;
                  onFileContents(contents);
                };
                reader.onerror = (e) => {
                  alert(e);
                };
                reader.readAsText(file);
                e.target.value = null;
              }}
            />
            <br />
            <Typography variant="caption">
              upload csv file. Each line must contains `recipient,amount`.
              Download
            </Typography>
            &nbsp;
            <Link
              variant="caption"
              sx={{
                ":hover": {
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                window.open(SEND_TEMPLATE, "_blank", "noopener,noreferrer");
              }}
            >
              sample.
            </Link>
          </Paper>
        </Grid>
        <Grid item md={7} xs={12}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              p: 1,
              minHeight: 320,
            }}
          >
            <Typography color="text.primary" variant="h6" fontWeight={600}>
              Messages
            </Typography>
            <Box
              sx={{
                p: 1,
              }}
            >
              {messages.length === 0 ? (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{
                    mt: 2,
                  }}
                >
                  No Messages
                </Typography>
              ) : null}
              {slicedMsgs.map((msg, index) => {
                return (
                  <Box
                    component="div"
                    key={index + PER_PAGE * (currentPage - 1)}
                  >
                    {RenderSendMessage(
                      msg,
                      index + PER_PAGE * (currentPage - 1),
                      chainInfo.config.currencies[0],
                      onDeleteMsg
                    )}
                    <Divider />
                  </Box>
                );
              })}

              {messages.length > 0 ? (
                <Pagination
                  sx={{
                    mt: 1,
                  }}
                  count={Math.ceil(messages.length / PER_PAGE)}
                  shape="circular"
                  onChange={(_, v) => {
                    setCurrentPage(v);
                    setSlicedMsgs(
                      messages?.slice((v - 1) * PER_PAGE, v * PER_PAGE)
                    );
                  }}
                />
              ) : null}
            </Box>
            {messages.length > 0 ? (
              <>
                <Box
                  sx={{
                    textAlign: "right",
                    mr: 2,
                  }}
                  onClick={() => {
                    setDisplayMemoField(!displayMemoField);
                    if (displayMemoField) setMemo("");
                  }}
                >
                  <Button
                    sx={{
                      mb: 2,
                      textTransform: "none",
                    }}
                    variant="text"
                  >
                    Add memo
                  </Button>
                </Box>
                {displayMemoField ? (
                  <Box
                    sx={{
                      ml: 1,
                      mr: 1,
                      mb: 2,
                    }}
                  >
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        label="Memo"
                        variant="outlined"
                        value={memo}
                        size="small"
                        onChange={(e) => setMemo(e.target.value)}
                      />
                    </FormControl>
                  </Box>
                ) : null}

                <Button
                  variant="contained"
                  disableElevation
                  onClick={onSubmitTxs}
                  sx={{
                    mb: 2,
                    textTransform: "none",
                  }}
                  disabled={submitTxStatus === "pending"}
                >
                  {submitTxStatus === "pending" ? "Please wait" : "Submit"}
                </Button>
              </>
            ) : null}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

MultiTx.propTypes = {
  chainInfo: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
};
