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
import {
  resetError,
  resetFeegrant,
  resetTxHash,
  removeFeegrant as removeFeegrantState,
  setFeegrant as setFeegrantState,
} from "../../features/common/commonSlice";
import { txUnjail } from "../../features/slashing/slashingSlice";
import { getUnjailAuthz } from "../../utils/authorizations";
import TextField from "@mui/material/TextField";
import FeegranterInfo from "../../components/FeegranterInfo";
import { useParams } from "react-router-dom";
import { getFeegrant, removeFeegrant as removeFeegrantLocalState } from "../../utils/localStorage";

export default function Unjail() {
  const params = useParams();

  const slashingTx = useSelector((state) => state.slashing.tx);
  const authzExecTx = useSelector((state) => state.authz.execTx);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const selectedNetwork = params?.networkName;
  const address = networks[nameToChainIDs[selectedNetwork]]?.walletInfo.bech32Address;
  const chainInfo = networks[nameToChainIDs[selectedNetwork]]?.network;

  const currency = networks[nameToChainIDs[selectedNetwork]]?.network.config.currencies[0];

  const selectedAuthz = useSelector((state) => state.authz.selected);
  const feegrant = useSelector((state) => state.common.feegrant?.[selectedNetwork]);

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
          feeAmount:
            chainInfo.config.gasPriceStep.average * 10 ** currency.coinDecimals,
          feegranter: feegrant?.granter,
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
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config.gasPriceStep.average * 10 ** currency.coinDecimals,
        feegranter: feegrant?.granter,
      });
    }
  };

  const removeFeegrant = () => {
    // Should we completely remove feegrant or only for this session.
    dispatch(removeFeegrantState(selectedNetwork));
    removeFeegrantLocalState(selectedNetwork);
  };

  useEffect(() => {
    const currentChainGrants = getFeegrant()?.[selectedNetwork];
    dispatch(setFeegrantState({
      grants: currentChainGrants,
      chainName: selectedNetwork.toLowerCase()
    }));
  }, [selectedNetwork, params])

  return (
    <Box
      compoment="div"
      sx={{
        mt: 6,
      }}
    >
      {feegrant?.granter?.length > 0 ? (
        <FeegranterInfo
          feegrant={feegrant}
          onRemove={() => {
            removeFeegrant();
          }}
        />
      ) : null}
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
