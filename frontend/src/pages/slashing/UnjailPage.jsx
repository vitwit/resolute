import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  authzExecHelper,
  getGrantsToMe,
} from "../../features/authz/authzSlice";
import {
  resetError,
  resetTxHash,
  removeFeegrant as removeFeegrantState,
  setFeegrant as setFeegrantState,
} from "../../features/common/commonSlice";
import { txUnjail } from "../../features/slashing/slashingSlice";
import TextField from "@mui/material/TextField";
import FeegranterInfo from "../../components/FeegranterInfo";
import { useParams } from "react-router-dom";
import { getFeegrant, removeFeegrant as removeFeegrantLocalState } from "../../utils/localStorage";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const filterUnjailAuthz = (grantsToMe) => {
  const granters = [];
  const grants = grantsToMe?.grants || [];
  for (const grant of grants) {
    const authorizationType = grant?.authorization["@type"];
    const isGenericAuthorization =
      authorizationType === "/cosmos.authz.v1beta1.GenericAuthorization";
    const isMsgUnjail =
      grant?.authorization.msg === "/cosmos.slashing.v1beta1.MsgUnjail";
    if (isGenericAuthorization && isMsgUnjail) {
      granters.push(grant.granter);
    }
  }
  return granters;
};

export default function Unjail() {
  const params = useParams();

  const slashingTx = useSelector((state) => state.slashing.tx);
  const authzExecTx = useSelector((state) => state.authz.execTx);
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const isAuthzMode = useSelector((state) => state.common.authzMode);

  const selectedNetwork = params?.networkName;
  const chainID = nameToChainIDs[selectedNetwork];
  const address = networks[chainID]?.walletInfo.bech32Address;
  const chainInfo = networks[chainID]?.network;
  const currency = networks[chainID]?.network.config.currencies[0];

  const feegrant = useSelector((state) => state.common.feegrant?.[selectedNetwork]);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe?.[chainID]);

  const [isNoAuthzs, setNoAuthzs] = useState(false);
  const [authzGrants, setAuthzGrants] = useState();
  const [granter, setGranter] = useState("");

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
    if (!isAuthzMode) {
      dispatch(
        txUnjail({
          validator: validator,
          denom: currency.coinMinimalDenom,
          chainId: chainInfo.config.chainId,
          rest: chainInfo.config.rest,
          aminoConfig: chainInfo.aminoConfig,
          prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
          feeAmount:
            chainInfo.config.feeCurrencies[0].gasPriceStep.average * 10 ** currency.coinDecimals,
          feegranter: feegrant?.granter,
        })
      );
    } else {
      authzExecHelper(dispatch, {
        type: "unjail",
        validator: validator,
        from: address,
        granter: granter,
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config.feeCurrencies[0].gasPriceStep.average * 10 ** currency.coinDecimals,
        feegranter: feegrant?.granter,
      });
    }
  };

  useEffect(() => {
    if (chainID?.length) {
      dispatch(
        getGrantsToMe({
          baseURL: chainInfo?.config.rest,
          grantee: address,
          chainID: chainID,
        })
      );
    }
  }, [chainID, address]);

  useEffect(() => {
    const result = filterUnjailAuthz(grantsToMe);
    if (result?.length === 0) {
      setNoAuthzs(true);
    } else {
      setNoAuthzs(false);
      setAuthzGrants(result);
    }
  }, [grantsToMe]);

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
      {isAuthzMode && isNoAuthzs ? (
        <>
          <Typography variant="h5">
            You don't have permission to execute this transcation
          </Typography>
        </>
      ) : (
        <>
          {feegrant?.granter?.length > 0 ? (
            <FeegranterInfo
              feegrant={feegrant}
              onRemove={() => {
                removeFeegrant();
              }}
            />
          ) : null}
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
                  {isAuthzMode && authzGrants?.length > 0 ? (
                    <FormControl
                      fullWidth
                      sx={{
                        mt: 1,
                      }}
                      required
                    >
                      <InputLabel id="granter-label">Granter</InputLabel>
                      <Select
                        labelId="granter-label"
                        id="granter-select"
                        value={granter}
                        label="Granter"
                        onChange={(e) => {
                          setGranter(e.target.value);
                        }}
                        size="small"
                      >
                        {authzGrants.map((granter, index) => (
                          <MenuItem id={index} value={granter}>
                            {granter}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : null}
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
        </>
      )}
    </Box>
  );
}
