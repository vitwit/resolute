import { Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import react, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Send from "../../../components/multisig/bulk/Send";
import UnDelegateForm from "../../../components/multisig/bulk/UnDelegateForm";
import RedelegateForm from "../../../components/multisig/bulk/RedelegateForm";
import { shortenAddress } from "../../../utils/util";
import { Divider } from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { getAllValidators } from "../../../features/staking/stakeSlice";
import Delegate from "../../../components/multisig/bulk/Delegate";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const MULTISIG_SEND_TEMPLATE = "https://resolute.vitwit.com/_static/send.csv";
const MULTISIG_DELEGATE_TEMPLATE =
  "https://resolute.vitwit.com/_static/delegate.csv";
const MULTISIG_UNDELEGATE_TEMPLATE =
  "https://resolute.vitwit.com/_static/undelegate.csv";
const MULTISIG_REDELEGATE_TEMPLATE =
  "https://resolute.vitwit.com/_static/redelegate.csv";

const SelectTransactionType = (props) => {
  return (
    <Box
      sx={{
        minHeight: 70,
      }}
    >
      <Button
        variant="contained"
        disableElevation
        sx={{
          textTransform: "none",
        }}
        size="small"
        onClick={() => props.onSelect("manual")}
      >
        Manual
      </Button>
      <Button
        variant="contained"
        disableElevation
        size="small"
        onClick={() => props.onSelect("file")}
        sx={{
          mb: 2,
          mt: 2,
          ml: 1,
          textTransform: "none",
        }}
      >
        Upload csv file
      </Button>
    </Box>
  );
};

const FileUpload = () => {
  const [txType, setTxType] = useState("Send");
  return (
    <Box
      sx={{
        minHeight: 70,
      }}
    >
      <FormControl
        fullWidth
        sx={{
          mt: 1,
        }}
      >
        <InputLabel id="demo-simple-select-label">
          Select Transaction
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={txType}
          label="Select Transaction"
          onChange={(event) => {
            setTxType(event.target.value);
          }}
        >
          <MenuItem value={"Send"}>Send</MenuItem>
          <MenuItem value={"Delegate"}>Delegate</MenuItem>
          <MenuItem value={"Redelegate"}>Redelegate</MenuItem>
          <MenuItem value={"Undelegate"}>Undelegate</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        disableElevation
        size="small"
        endIcon={<FileDownloadOutlinedIcon />}
        sx={{
          textTransform: "none",
        }}
        onClick={() => {
          switch (txType) {
            case "Send":
              window.open(
                MULTISIG_SEND_TEMPLATE,
                "_blank",
                "noopener,noreferrer"
              );
              break;
            case "Delegate":
              window.open(
                MULTISIG_DELEGATE_TEMPLATE,
                "_blank",
                "noopener,noreferrer"
              );
              break;
            case "Undelegate":
              window.open(
                MULTISIG_UNDELEGATE_TEMPLATE,
                "_blank",
                "noopener,noreferrer"
              );
              break;
            case "Redelegate":
              window.open(
                MULTISIG_REDELEGATE_TEMPLATE,
                "_blank",
                "noopener,noreferrer"
              );
              break;
            default:
                alert("unknown message type")
          }
        }}
      >
        Download template
      </Button>
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
        <input
          id="multisig_file"
          accept="*.csv"
          hidden
          type="file"
          onChange={(e) => {
            console.log(e.target.files);

            const file = e.target.files[0];
            if (!file) {
              return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
              var contents = e.target.result;
              console.log(contents);
            };
            reader.readAsText(file);
          }}
        />
        Upload csv file
      </Button>
    </Box>
  );
};

export default function PageCreateTx() {
  const { address } = useParams();

  const [txType, setTxType] = useState("");

  const wallet = useSelector((state) => state.wallet);
  const { chainInfo, addr, connected } = wallet;

  const validators = useSelector((state) => state.staking.validators);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getAllValidators({
        baseURL: chainInfo.config.rest,
        status: null,
      })
    );
  }, []);

  const handleTypeChange = (event) => {
    setTxType(event.target.value);
  };

  const [messages, setMessages] = useState([]);

  const renderMessage = (msg, index) => {
    console.log(msg);
    switch (msg.typeUrl) {
      case "/cosmos.bank.v1beta1.MsgSend":
        return RenderSendMessage(msg, index);
      case "/cosmos.staking.v1beta1.MsgDelegate":
        return RenderDelegateMessage(msg, index);
      case "/cosmos.staking.v1beta1.MsgUndelegate":
        return RenderUnDelegateMessage(msg, index);
      default:
        return "";
    }
  };

  const [mode, setMode] = useState("");

  return (
    <>
      <Typography
        variant="h6"
        color="text.primary"
        sx={{
          textAlign: "left",
        }}
        fontWeight={500}
      >
        Create Multisig Transaction
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 1,
        }}
      >
        <Grid item md={5} xs={12}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              p: 3,
            }}
          >
            {mode === "" ? (
              <SelectTransactionType onSelect={(mode) => setMode(mode)} />
            ) : mode === "manual" ? (
              <>
                <FormControl
                  fullWidth
                  sx={{
                    mt: 1,
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    Select Transaction
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={txType}
                    label="Select Transaction"
                    onChange={handleTypeChange}
                  >
                    <MenuItem value={"Send"}>Send</MenuItem>
                    <MenuItem value={"Delegate"}>Delegate</MenuItem>
                    <MenuItem value={"Redelegate"}>Redelegate</MenuItem>
                    <MenuItem value={"Undelegate"}>Undelegate</MenuItem>
                  </Select>
                </FormControl>
              </>
            ) : (
              <FileUpload />
            )}

            {txType === "Send" ? (
              <Send
                chainInfo={chainInfo}
                address={address}
                onSend={(payload) => {
                  console.log(payload);
                  setMessages([...messages, payload]);
                }}
              />
            ) : null}

            {txType === "Delegate" ? (
              <Delegate
                chainInfo={chainInfo}
                address={address}
                validators={validators}
                onDelegate={(payload) => {
                  console.log(payload);
                  setMessages([...messages, payload]);
                }}
              />
            ) : null}

            {txType === "Redelegate" ? (
              <RedelegateForm chainInfo={chainInfo} address={address} />
            ) : null}

            {txType === "Undelegate" ? (
              <UnDelegateForm
                chainInfo={chainInfo}
                address={address}
                onUndelegate={(payload) => {
                  console.log(payload);
                  setMessages([...messages, payload]);
                }}
              />
            ) : null}
          </Paper>
        </Grid>

        <Grid item md={7} xs={12}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              p: 1,
              minHeight: 100,
            }}
          >
            <Typography color="text.primary" variant="h6" fontWeight={600}>
              Messages
            </Typography>
            <Box
              sx={{
                p: 2,
              }}
            >
              {messages.map((msg, index) => {
                return (
                  <Box component="div" key={index}>
                    {renderMessage(msg, index)}
                    <Divider />
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

const RenderSendMessage = (message, index) => {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pt: 1.5,
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
        }}
      >
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          #{index + 1}&nbsp;&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          Send&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          10ATOM&nbsp;
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          to&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {shortenAddress("cosmos1uz3spf69wjerxd278y85gpge08mhn8k4rltrut", 21)}
        </Typography>
      </Box>
      <IconButton
        color="error"
        aria-label="delete transaction"
        component="label"
      >
        <DeleteOutline />
      </IconButton>
    </Box>
  );
};

const RenderDelegateMessage = (message, index) => {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pt: 1.5,
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
        }}
      >
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          #{index + 1}&nbsp;&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          Delegate&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          100ATOM&nbsp;
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          to&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {shortenAddress(
            "cosmosvaloper12fprpy4dtgcxzlwdssztu5gg56dx9ctlns72v7",
            21
          )}
        </Typography>
      </Box>
      <IconButton
        color="error"
        aria-label="delete transaction"
        component="label"
      >
        <DeleteOutline />
      </IconButton>
    </Box>
  );
};

const RenderUnDelegateMessage = (message, index) => {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pt: 1.5,
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
        }}
      >
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          #{index + 1}&nbsp;&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          Undelegate&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          10ATOM&nbsp;
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          from&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {shortenAddress("cosmos1uz3spf69wjerxd278y85gpge08mhn8k4rltrut", 21)}
        </Typography>
      </Box>
      <IconButton
        color="error"
        aria-label="delete transaction"
        component="label"
      >
        <DeleteOutline />
      </IconButton>
    </Box>
  );
};
