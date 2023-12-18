import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Decimal } from '@cosmjs/math';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import { formatCoin } from '@/utils/util';
import {
  autoCompleteStyles,
  autoCompleteTextFieldStyles,
  textFieldStyles,
} from '../../styles';
import { getDelegations } from '@/store/features/staking/stakeSlice';

interface ReDelegateProps {
  chainID: string;
  address: string;
  onDelegate: (payload: Msg) => void;
  currency: Currency;
  availableBalance: number;
  baseURL: string;
}

const ReDelegate: React.FC<ReDelegateProps> = (props) => {
  const { chainID, address, onDelegate, currency, baseURL } = props;
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      amount: 0,
      validatorSrcAddress: null,
      validatorDstAddress: null,
      delegator: address,
    },
  });

  const validators = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.validators
  );

  const delegations = useAppSelector(
    (state: RootState) => state.staking.chains[chainID].delegations
  )

  useEffect(() => {
    dispatch(getDelegations({ address, chainID, baseURL }))
  }, [])

  interface stakeBal {
    amount: string;
    denom: string;
  }

  const [selectedValBal, setSelectedValBal] = useState<stakeBal>({ amount: '', denom: '' });

  const [data, setData] = useState<{ label: string; value: string, amount: stakeBal }[]>([]);
  const [destVals, setDestVals] = useState<{ label: string; value: string, amount: stakeBal }[]>([]);

  useEffect(() => {
    const data = [];
    const destVals = [];

    const totalDelegations = delegations?.delegations?.delegation_responses || []

    for (let j = 0; j < totalDelegations.length; j++) {
      const del = totalDelegations[j]

      for (let i = 0; i < validators.activeSorted.length; i++) {
        const validator = validators.active[validators.activeSorted[i]];
        if (del?.delegation?.validator_address === validator.operator_address) {
          const temp = {
            label: validator.description.moniker,
            value: validators.activeSorted[i],
            amount: del.balance
          };

          data.push(temp);
        }

        const temp = {
          label: validator.description.moniker,
          value: validators.activeSorted[i],
          amount: del.balance
        };

        destVals.push(temp)
      }

      for (let i = 0; i < validators.inactiveSorted.length; i++) {
        const validator = validators.inactive[validators.inactiveSorted[i]];
        if (!validator.jailed) {
          if (del?.delegation?.validator_address === validator.operator_address) {
            const temp = {
              label: validator.description.moniker,
              value: validators.inactiveSorted[i],
              amount: del.balance
            };

            data.push(temp);
          }

          const temp = {
            label: validator.description.moniker,
            value: validators.activeSorted[i],
            amount: del.balance
          };
  
          destVals.push(temp)
        }
      }
    }


    setData(data);
    setDestVals(destVals)
  }, [validators]);

  const onSubmit = (data: {
    amount: number;
    validatorSrcAddress: null | {
      value: string;
    };
    validatorDstAddress: null | {
      value: string;
    };
    delegator: string;
  }) => {
    if (data.validatorSrcAddress) {
      const baseAmount = Decimal.fromUserInput(
        data.amount.toString(),
        Number(currency?.coinDecimals)
      ).atomics;
      const msgReDelegate = {
        delegatorAddress: data.delegator,
        validatorSrcAddress: data.validatorSrcAddress?.value,
        validatorDstAddress: data.validatorDstAddress?.value,
        amount: {
          amount: baseAmount,
          denom: currency?.coinMinimalDenom,
        },
      };

      console.log('redelegate====', msgReDelegate)
      onDelegate({
        typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
        value: msgReDelegate,
      });
    }
  };

  const setAmountValue = () => {
    setValue('amount', Number(selectedValBal?.amount));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="delegator"
        control={control}
        render={({ field }) => (
          <TextField
            className="bg-[#FFFFFF1A]"
            {...field}
            sx={textFieldStyles}
            placeholder="From"
            disabled
            fullWidth
            InputProps={{
              sx: {
                input: {
                  color: 'white !important',
                  fontSize: '14px',
                  padding: 2,
                },
              },
            }}
          />
        )}
      />
      <Controller
        name="validatorSrcAddress"
        control={control}
        defaultValue={null}
        rules={{ required: 'Source Validator is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Autocomplete
            disablePortal
            value={value}
            sx={autoCompleteStyles}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            options={data}
            onChange={(event, item) => {
              onChange(item);
              setSelectedValBal({ amount: (Number(item?.amount?.amount) / 10 ** currency.coinDecimals).toFixed(2) || '', denom: item?.amount?.denom || '' })
            }}
            renderInput={(params) => (
              <TextField
                className="bg-[#FFFFFF1A]"
                {...params}
                required
                placeholder="Select source validator"
                error={!!error}
                helperText={error ? error.message : null}
                sx={autoCompleteTextFieldStyles}
              />
            )}
          />
        )}
      />
      <Controller
        name="validatorDstAddress"
        control={control}
        defaultValue={null}
        rules={{ required: 'Destination Validator is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Autocomplete
            disablePortal
            value={value}
            sx={autoCompleteStyles}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            options={destVals}
            onChange={(event, item) => {
              onChange(item);
            }}
            renderInput={(params) => (
              <TextField
                className="bg-[#FFFFFF1A]"
                {...params}
                required
                placeholder="Select destination validator"
                error={!!error}
                helperText={error ? error.message : null}
                sx={autoCompleteTextFieldStyles}
              />
            )}
          />
        )}
      />
      <div
        className="text-[12px] text-[#FFFFFF80] text-right cursor-pointer hover:underline underline-offset-2"
        onClick={setAmountValue}
      >
        {formatCoin(Number(selectedValBal?.amount), selectedValBal?.denom)}
      </div>
      <Controller
        name="amount"
        control={control}
        rules={{
          required: 'Amount is required',
          validate: (value) => {
            return Number(value) > 0 && Number(value) <= Number(selectedValBal?.amount);
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            className="bg-[#FFFFFF1A]"
            {...field}
            sx={textFieldStyles}
            error={!!error}
            helperText={
              errors.amount?.type === 'validate'
                ? 'Insufficient balance'
                : errors.amount?.message
            }
            placeholder="Amount"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {currency.coinDenom}
                </InputAdornment>
              ),
              sx: {
                input: {
                  color: 'white',
                  fontSize: '14px',
                  padding: 2,
                },
              },
            }}
          />
        )}
      />

      <button className="create-txn-form-btn" type="submit">
        Add
      </button>
    </form>
  );
};

export default ReDelegate;
