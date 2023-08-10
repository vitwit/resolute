import { Box, Button, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Decimal } from "@cosmjs/math";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import { UnDelegate } from "../../../txns/staking";

UnDelegateForm.propTypes = {
  chainInfo: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  onUndelegate: PropTypes.func.isRequired,
};

function parseDelegation(delegation, currency) {
  return (
    parseFloat(delegation?.delegation?.shares) /
    (10 ** currency?.coinDecimals).toFixed(6)
  );
}

export default function UnDelegateForm(props) {
  const { chainInfo, address } = props;

  const chainID = chainInfo?.config?.chainId;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
      validator: null,
      delegator: address,
    },
  });

  const validators = useSelector(
    (state) => state.staking.chains[chainID]?.validators
  );
  const delegations = useSelector(
    (state) => state.staking.chains?.[chainID].delegations?.delegations?.delegations
  );
  
  const [data, setData] = useState([]);

  useEffect(() => {
    const data = [];

    for (let i = 0; i < delegations.length; i++) {
      if (validators.active[delegations[i].delegation.validator_address]) {
        const temp = {
          label:
            validators.active[delegations[i].delegation.validator_address]
              .description.moniker,
          value: {
            shares: parseDelegation(
              delegations[i],
              chainInfo.config.currencies[0]
            ),
            validator: delegations[i].delegation.validator_address,
          },
        };
        data.push(temp);
      } else if (
        validators.inactive[delegations[i].delegation.validator_address]
      ) {
        const temp = {
          label:
            validators.inactive[delegations[i].delegation.validator_address]
              .description.moniker,
          value: {
            shares: parseDelegation(
              delegations[i],
              chainInfo.config.currencies[0]
            ),
            validator: delegations[i].delegation.validator_address,
          },
        };
        data.push(temp);
      }
    }

    setData(data);
  }, [delegations]);

  const currency = chainInfo.config.currencies[0];
  const onSubmit = (data) => {
    const baseAmount = Decimal.fromUserInput(
      data.amount,
      Number(currency?.coinDecimals)
    ).atomics;

    const msgUnDelegate = UnDelegate(
      data.delegator,
      data.validator?.value.validator,
      baseAmount,
      chainInfo.config.currencies[0].coinMinimalDenom
    );
    props.onUndelegate(msgUnDelegate);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="delegator"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            sx={{
              mt: 2,
            }}
            label="Delegator"
            disabled
            fullWidth
          />
        )}
      />
      <Controller
        name="validator"
        control={control}
        defaultValue={null}
        rules={{ required: "Validator is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Autocomplete
            disablePortal
            label="validator"
            value={value?.validator}
            sx={{
              mt: 2,
              mb: 2,
            }}
            isOptionEqualToValue={(option, value) =>
              option.value?.validator === value.value?.validator
            }
            options={data}
            onChange={(event, item) => {
              onChange(item);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                placeholder="select validator"
                error={!!error}
                helperText={error ? error.message : null}
                label="validator"
              />
            )}
          />
        )}
      />

      <Controller
        name="amount"
        control={control}
        rules={{
          required: "Amount is required",
          validate: (value) => {
            return Number(value) > 0;
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            sx={{
              mb: 2,
            }}
            error={!!error}
            helperText={
              errors.amount?.type === "validate"
                ? "Invalid amount"
                : error?.message
            }
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
      <Box
        component="div"
        sx={{
          textAlign: "center",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          disableElevation
          sx={{
            mt: 2,
            justifyContent: "center",
            textTransform: "none",
          }}
        >
          Add transaction
        </Button>
      </Box>
    </form>
  );
}
