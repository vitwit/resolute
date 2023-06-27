import React from "react";
import PropTypes from "prop-types";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm, Controller } from "react-hook-form";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export function DialogDelegate(props) {
  const {
    onClose,
    open,
    params,
    validator,
    balance,
    onDelegate,
    loading,
    displayDenom,
    authzLoading,
    isNoDelegateAuthzs,
    isAuthzMode,
    delegateGrantsToMe,
    setDelegateGranter,
    delegateGranter,
  } = props;

  const handleClose = () => {
    onClose();
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = (data) => {
    onDelegate({
      validator: validator.operator_address,
      amount: data.amount,
    });
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        {isAuthzMode && isNoDelegateAuthzs ? (
          <>
            <DialogContent>
              <Typography>You don't have authz permission to delegate.</Typography>
            </DialogContent>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Typography variant="h6" color="text.primary" fontWeight={800}>
                {validator?.description?.moniker}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Commission:&nbsp;
                {(
                  parseFloat(validator?.commission?.commission_rates.rate) *
                  100.0
                ).toFixed(2)}
                %
              </Typography>
              <hr />
              <Alert severity="info">
                <b>
                  Staking will lock your funds for{" "}
                  {Math.floor(
                    parseInt(params?.params?.unbonding_time) / (3600 * 24)
                  )}
                  + days.
                </b>
                <br />
                You will need to undelegate in order for your staked assets to
                be liquid again. This process will take{" "}
                {Math.floor(
                  parseInt(params?.params?.unbonding_time) / (3600 * 24)
                )}{" "}
                days to complete.
              </Alert>

              <Typography
                color="text.primary"
                fontWeight={600}
                style={{ marginTop: 16 }}
              >
                Available Balance
              </Typography>
              <Typography
                color="text.primary"
                variant="body1"
                className="hover-link"
                onClick={() => {
                  setValue("amount", balance);
                }}
              >
                {balance}
              </Typography>
              <div style={{ marginTop: 16 }}>
                {isAuthzMode && delegateGrantsToMe?.length > 0 ? (
                  <FormControl
                    fullWidth
                    sx={{
                      mt: 1,
                      mb: 3,
                    }}
                  >
                    <InputLabel id="granter-label">From *</InputLabel>
                    <Select
                      labelId="granter-label"
                      id="granter-select"
                      value={delegateGranter}
                      label="From *"
                      onChange={(e) => {
                        setDelegateGranter(e.target.value);
                      }}
                      size="small"
                    >
                      {delegateGrantsToMe.map((granter, index) => (
                        <MenuItem id={index} value={granter}>
                          {granter}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : null}
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: "Amount is required",
                    validate: (value) => {
                      return Number(value) > 0 && Number(value) <= balance;
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Amount to delegate"
                      fullWidth
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            {displayDenom}
                          </InputAdornment>
                        ),
                      }}
                      error={!!errors.amount}
                      helperText={
                        errors.amount?.type === "validate"
                          ? "Insufficient balance"
                          : errors.amount?.message
                      }
                    />
                  )}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                color="secondary"
                className="button-capitalize-title"
                disableElevation
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disableElevation
                type="submit"
                disabled={loading === "pending" || authzLoading === "pending"}
                className="button-capitalize-title"
              >
                {loading === "pending" || authzLoading === "pending" ? (
                  <CircularProgress size={25} />
                ) : (
                  "Delegate"
                )}
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </>
  );
}

DialogDelegate.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDelegate: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  validator: PropTypes.object.isRequired,
  balance: PropTypes.number.isRequired,
  displayDenom: PropTypes.string.isRequired,
  authzLoading: PropTypes.string.isRequired,
};
