import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import { Checkbox, FormControlLabel } from "@mui/material";

Send.propTypes = {
  onSend: PropTypes.func.isRequired,
  chainInfo: PropTypes.object.isRequired,
  sendTx: PropTypes.object.isRequired,
  available: PropTypes.number.isRequired,
  authzTx: PropTypes.object.isRequired,
  feegrant: PropTypes.object.isRequired,
};

export default function Send(props) {
  const { chainInfo, sendTx, available, onSend, authzTx, feegrant } = props;

  const currency = chainInfo.config.currencies[0];
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      amount: 0,
      recipient: "",
    },
  });

  const [feegranter, setFeegranter] = useState(feegrant?.granter || "");
  const handleFeeGranter = (e) => {
    if (e.target.checked) {
      setFeegranter(feegrant.granter);
    } else {
      setFeegranter("");
    }
  }

  const onSubmit = (data) => {
    onSend({
      to: data.recipient,
      amount: Number(data.amount) * 10 ** currency.coinDecimals,
      denom: currency.coinMinimalDenom,
      feegranter,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
      }}
    >
      <Typography color="text.primary" variant="h6" fontWeight={600}>
        Send
      </Typography>
      <br />
      <Box
        noValidate
        autoComplete="off"
        sx={{
          "& .MuiTextField-root": { mt: 1.5, mb: 1.5 },
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
            Availabel:&nbsp;{available}
            {currency?.coinDenom}
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
          <div style={{ textAlign: "right" }}>
            <FormControlLabel
              value="Use Feegrant"
              control={
                <Checkbox
                  onChange={handleFeeGranter}
                  disabled={feegrant?.granter?.length === 0}
                  defaultChecked={feegrant?.granter?.length > 0}
                />
              }
              label="Use Feegrant"
              labelPlacement="end"
            />
          </div>

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
