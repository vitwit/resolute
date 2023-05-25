import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SelectNetwork from "./common/SelectNetwork";

Send.propTypes = {
  onSend: PropTypes.func.isRequired,
  chainInfo: PropTypes.object.isRequired,
  sendTx: PropTypes.object.isRequired,
  available: PropTypes.number.isRequired,
  authzTx: PropTypes.object.isRequired,
  networkName: PropTypes.string.isRequired,
};

export default function Send(props) {
  const { chainInfo, sendTx, available, onSend, authzTx } = props;

  const params = useParams();
  const navigate = useNavigate();

  const networks = useSelector((state) => state.wallet.networks);
  const selectedAuthz = useSelector((state) => state.authz.selected);
  const selectNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(params?.networkName);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const currency = chainInfo?.config?.currencies[0];
  const chainIDs = Object.keys(networks);

  useEffect(() => {
    if (!currentNetwork) {
      setCurrentNetwork(selectNetwork);
    }
  }, []);

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      amount: 0,
      recipient: "",
    },
  });

  const onSubmit = (data) => {
    onSend({
      to: data.recipient,
      amount: Number(data.amount) * 10 ** currency.coinDecimals,
      denom: currency.coinMinimalDenom,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color="text.primary" variant="h6" fontWeight={600}>
          Send
        </Typography>
        <SelectNetwork
          onSelect={(name) => {
            setCurrentNetwork(name);
            navigate(`/${name}/transfers`)
          }}
          networks={Object.keys(nameToChainIDs)}
          defaultNetwork={selectNetwork?.length > 0 ? selectNetwork.toLowerCase().replace(/ /g, "") : "cosmoshub"}
        />
      </Box>
      <Box
        noValidate
        autoComplete="off"
        sx={{
          "& .MuiTextField-root": { mt: 1.5, mb: 1.5 },
          mt: 2,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              name="recipient"
              control={control}
              rules={{ required: "Recipient is required" }}
              render={({ field }) => (
                <TextField {...field} required label="Recipient" fullWidth />
              )}
            />
          </div>
          <Typography
            variant="body2"
            color="text.primary"
            style={{ textAlign: "end" }}
            className="hover-link"
            onClick={() => setValue("amount", available)}
          >
            Available:&nbsp;{available}
            &nbsp;{currency?.coinDenom}
          </Typography>
          <Controller
            name="amount"
            control={control}
            rules={{ required: "Amount is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="Amount"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      {currency?.coinDenom}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <div>
            <Button
              type="submit"
              variant="outlined"
              disableElevation
              disabled={
                sendTx.status === "pending" || authzTx.status === "pending"
              }
              sx={{
                textTransform: "none",
                mt: 2,
              }}
              size="medium"
            >
              {sendTx.status === "pending" || authzTx.status === "pending" ? (
                <>
                  <CircularProgress size={18} />
                  &nbsp;&nbsp;Please wait...
                </>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </form>
      </Box>
    </Paper>
  );
}
