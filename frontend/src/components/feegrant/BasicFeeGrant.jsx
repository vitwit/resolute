import React, { useState } from "react";
import { FormControl, InputAdornment, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function BasicFeeGrant(props) {
  const { granters, granter, setGranter } = props;
  const params = useParams();
  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const isAuthzMode = useSelector((state) => state.common.authzMode);

  const [currentNetwork, setCurrentNetwork] = useState(
    params?.networkName || selectedNetwork
  );

  const currency =
    networks[nameToChainIDs[currentNetwork]]?.network.config.currencies;

  const { control } = useFormContext();

  return (
    <>
      {isAuthzMode && granters?.length > 0 ? (
        <FormControl
          fullWidth
          sx={{
            mt: 1,
            mb: 2,
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
            sx={{
              p: 1
            }}
          >
            {granters.map((granter, index) => (
              <MenuItem id={index} value={granter}>
                {granter}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}
      <FormControl sx={{ mb: 2 }} fullWidth>
        <Controller
          name="grantee"
          control={control}
          rules={{ required: "Grantee is required" }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Grantee"
              required
              error={!!error}
              helperText={error ? error.message : null}
              fullWidth
            />
          )}
        />
      </FormControl>
      <div>
        <Controller
          name="spendLimit"
          control={control}
          rules={{
            validate: (value) => {
              return Number(value) >= 0;
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              label="Spend Limit"
              {...field}
              inputMode="decimal"
              error={!!error}
              helperText={
                error
                  ? error.message.length === 0
                    ? "Invalid spend limit"
                    : error.message
                  : null
              }
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
      </div>
      <Controller
        name="expiration"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              disablePast
              renderInput={(props) => (
                <TextField style={{ marginTop: 32 }} fullWidth {...props} />
              )}
              label="Expiration"
              {...field}
              error={!!error}
              helperText={error ? error.message : null}
            />
          </LocalizationProvider>
        )}
      />
      <br />
    </>
  );
}

export default BasicFeeGrant;
