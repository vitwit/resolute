import { InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Decimal } from "@cosmjs/math";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import { Redelegate } from "../../../txns/staking";

import { Controller, useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";

RedelegateForm.propTypes = {
  chainInfo: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  onRedelegate: PropTypes.object.isRequired,
};

function parseDelegation(delegation, currency) {
  return (
    parseFloat(delegation?.delegation?.shares) /
    (10 ** currency?.coinDecimals).toFixed(6)
  );
}

export default function RedelegateForm(props) {
  const params = useParams();

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [currentNetwork, setCurrentNetwork] = useState(
    params?.networkName || selectedNetwork.toLowerCase()
  );
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const chainID = nameToChainIDs[currentNetwork];
  const chainInfo = networks[chainID]?.network;

  const {
    control,
    formState: { errors },
  } = useFormContext({
    defaultValues: {
      amount: 0,
      source: null,
      destination: null,
    },
  });

  var validators = useSelector((state) => state.staking.chains[nameToChainIDs[currentNetwork]]?.validators);
  const delegations = useSelector(
    (state) => state.staking.chains?.[chainID]?.delegations?.delegations
  );

  var [data, setData] = useState([]);

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

    const msgRedelegate = Redelegate(
      data.delegator,
      data.source?.value?.validator,
      data.destination?.value,
      baseAmount,
      chainInfo.config.currencies[0].coinMinimalDenom
    );

    props.onRedelegate(msgRedelegate);
  };

  const [vals, setVals] = useState([]);
  useEffect(() => {
    const data = [];
    for (let i = 0; i < validators.activeSorted.length; i++) {
      const validator = validators.active[validators.activeSorted[i]];
      const temp = {
        label: validator.description.moniker,
        value: validators.activeSorted[i],
      };
      data.push(temp);
    }

    for (let i = 0; i < validators.inactiveSorted.length; i++) {
      const validator = validators.inactive[validators.inactiveSorted[i]];
      if (!validator.jailed) {
        const temp = {
          label: validator.description.moniker,
          value: validators.inactiveSorted[i],
        };
        data.push(temp);
      }
    }

    setVals(data);
  }, [validators]);

  return (
    <>
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
        name="source"
        control={control}
        defaultValue={null}
        rules={{ required: "Source Validator is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Autocomplete
            disablePortal
            label="Source validator"
            value={value}
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
                placeholder="from validator"
                error={!!error}
                helperText={error ? error.message : null}
                label="Source validator"
              />
            )}
          />
        )}
      />

      <Controller
        name="destination"
        control={control}
        defaultValue={null}
        rules={{ required: "Destination validator is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Autocomplete
            disablePortal
            label="destination"
            value={value}
            sx={{
              mt: 2,
              mb: 2,
            }}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            options={vals}
            onChange={(event, item) => {
              onChange(item);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                placeholder="select destination validator"
                error={!!error}
                helperText={error ? error.message : null}
                label="destination"
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
    </>
  );
}
