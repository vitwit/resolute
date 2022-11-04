import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { authzExecHelper } from "../../features/authz/authzSlice";
import { resetError, resetTxHash } from "../../features/common/commonSlice";
import { txUnjail } from "../../features/slashing/slashingSlice";
import { getUnjailAuthz } from "../../utils/authorizations";
import TextField from "@mui/material/TextField";

export default function Unjail() {
  const slashingTx = useSelector((state) => state.slashing.tx);
  const address = useSelector((state) => state.wallet.address);
  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const authzExecTx = useSelector((state) => state.authz.execTx);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const currency = useSelector(
    (state) => state.wallet.chainInfo.config.currencies[0]
  );

  const selectedAuthz = useSelector((state) => state.authz.selected);

  const authzUnjail = useMemo(
    () => getUnjailAuthz(grantsToMe.grants, selectedAuthz.granter),
    [grantsToMe.grants]
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetError());
    dispatch(resetTxHash());
  }, []);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      validator: "",
    },
  });

  const onSubmit = (data) => {
    onUnjailTx(data.validator);
  };

  const onUnjailTx = (validator) => {
    if (selectedAuthz.granter.length === 0) {
      dispatch(
        txUnjail({
          validator: validator,
          denom: currency.coinMinimalDenom,
          chainId: chainInfo.config.chainId,
          rest: chainInfo.config.rest,
          aminoConfig: chainInfo.aminoConfig,
          prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
          feeAmount: chainInfo.config.gasPriceStep.average * (10 ** currency.coinDecimals),
        })
      );
    } else {
      authzExecHelper(dispatch, {
        type: "unjail",
        validator: validator,
        from: address,
        granter: selectedAuthz.granter,
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rpc: chainInfo.config.rpc,
        feeAmount: chainInfo.config.gasPriceStep.average * (10 ** currency.coinDecimals),
      });
    }
  };

  return (
    <Box
      compoment="div"
      sx={{
        mt: 6,
      }}
    >
      {selectedAuthz.granter.length > 0 &&
      authzUnjail?.granter !== selectedAuthz.granter ? (
        <Alert>You don't have permission to execute this transcation</Alert>
      ) : (
        <Grid container>
          <Grid item md={3} xs={12}></Grid>
          <Grid item md={6} xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
              }}
            >
              <Typography
                variant="h6"
                color="text.primary"
                fontWeight={500}
                gutterBottom
                sx={{
                  mb: 2,
                }}
              >
                Unjail
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Controller
                    name="validator"
                    control={control}
                    rules={{ required: "Validator is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        label="Validator"
                        fullWidth
                        sx={{
                          mb: 2,
                        }}
                      />
                    )}
                  />
                </div>
                <Button
                  disableElevation
                  sx={{
                    textTransform: "none",
                    mt: 2,
                  }}
                  variant="contained"
                  // onClick={() => onUnjailTx()}
                  type="submit"
                  disabled={
                    slashingTx.status === "pending" ||
                    authzExecTx.status === "pending"
                  }
                >
                  {slashingTx.status === "pending" ||
                  authzExecTx.status === "pending" ? (
                    <CircularProgress size={25} />
                  ) : (
                    "Unjail"
                  )}
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item md={3} xs={12}></Grid>
        </Grid>
      )}
    </Box>
  );
}
