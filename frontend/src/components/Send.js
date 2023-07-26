import React from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { getICNSName } from "../features/common/commonSlice";

Send.propTypes = {
  onSend: PropTypes.func.isRequired,
  chainInfo: PropTypes.object.isRequired,
  sendTx: PropTypes.object.isRequired,
  available: PropTypes.number.isRequired,
  authzTx: PropTypes.object.isRequired,
  networkName: PropTypes.string.isRequired,
  authzMode: PropTypes.bool.isRequired,
  grantsToMe: PropTypes.array.isRequired,
};

export default function Send(props) {
  const {
    chainInfo,
    sendTx,
    available,
    onSend,
    authzTx,
    isAuthzMode,
    grantsToMe,
    setGranter,
    granter,
  } = props;

  const dispatch = useDispatch();
  const currency = chainInfo?.config?.currencies[0];
  const icnsNames = useSelector((state) => state.common.icnsNames);

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
      granter: granter,
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
    <Paper
      elevation={0}
      sx={{
        p: 4,
      }}
    >
      <Box>
        <Typography color="text.primary" variant="h6" fontWeight={600}>
          Send
        </Typography>
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
          {isAuthzMode && grantsToMe?.length > 0 ? (
            <FormControl
              fullWidth
              sx={{
                mt: 1,
              }}
            >
              <InputLabel id="granter-label">From *</InputLabel>
              <Select
                labelId="granter-label"
                id="granter-select"
                value={granter}
                label="From *"
                onChange={(e) => {
                  setGranter(e.target.value);
                }}
                size="small"
              >
                {grantsToMe.map((granter, index) => (
                  <MenuItem id={index} value={granter}>
                    {fetchName(granter) || granter}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
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

Send.propTypes = {
  chainInfo: PropTypes.object.isRequired,
  available: PropTypes.object.isRequired,
  onSend: PropTypes.func.isRequired,
  sendTx: PropTypes.object.isRequired,
  authzTx: PropTypes.object.isRequired,
};
