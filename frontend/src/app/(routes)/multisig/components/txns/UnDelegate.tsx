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
import { INSUFFICIENT_BALANCE } from '@/utils/errors';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

interface UnDelegateProps {
  chainID: string;
  address: string;
  onDelegate: (payload: Msg) => void;
  currency: Currency;
  availableBalance: number;
  baseURL: string;
}

const UnDelegate: React.FC<UnDelegateProps> = (props) => {
  const { chainID, address, onDelegate, currency } = props;
  const dispatch = useAppDispatch();
  const {getChainInfo} = useGetChainInfo();
  const {restURLs} = getChainInfo(chainID)
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      amount: 0,
      validator: null,
      delegator: address,
    },
  });

  const validators = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.validators
  );

  const delegations = useAppSelector(
    (state: RootState) => state.staking.chains[chainID].delegations
  );

  useEffect(() => {
    dispatch(getDelegations({ address, chainID, baseURLs: restURLs }));
  }, []);

  interface stakeBal {
    amount: string;
    denom: string;
  }

  const [selectedValBal, setSelectedValBal] = useState<stakeBal>({
    amount: '',
    denom: '',
  });

  const [data, setData] = useState<
    { label: string; value: string; amount: stakeBal }[]
  >([]);

  useEffect(() => {
    const data = [];

    const totalDelegations =
      delegations?.delegations?.delegation_responses || [];

    for (let j = 0; j < totalDelegations.length; j++) {
      const del = totalDelegations[j];

      for (let i = 0; i < validators.activeSorted.length; i++) {
        const validator = validators.active[validators.activeSorted[i]];
        if (del?.delegation?.validator_address === validator.operator_address) {
          const temp = {
            label: validator.description.moniker,
            value: validators.activeSorted[i],
            amount: del.balance,
          };

          data.push(temp);
        }
      }

      for (let i = 0; i < validators.inactiveSorted.length; i++) {
        const validator = validators.inactive[validators.inactiveSorted[i]];
        if (!validator.jailed) {
          if (
            del?.delegation?.validator_address === validator.operator_address
          ) {
            const temp = {
              label: validator.description.moniker,
              value: validators.inactiveSorted[i],
              amount: del.balance,
            };

            data.push(temp);
          }
        }
      }
    }

    setData(data);
  }, [validators]);

  const onSubmit = (data: {
    amount: number;
    validator: null | {
      value: string;
    };
    delegator: string;
  }) => {
    if (data.validator) {
      const baseAmount = Decimal.fromUserInput(
        data.amount.toString(),
        Number(currency?.coinDecimals)
      ).atomics;
      const msgUnDelegate = {
        delegatorAddress: data.delegator,
        validatorAddress: data.validator?.value,
        amount: {
          amount: baseAmount,
          denom: currency?.coinMinimalDenom,
        },
      };

      onDelegate({
        typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
        value: msgUnDelegate,
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
        name="validator"
        control={control}
        defaultValue={null}
        rules={{ required: 'Validator is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Autocomplete
            disablePortal
            value={value}
            sx={{ ...autoCompleteStyles, ...{ mb: '16px' } }}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            options={data}
            onChange={(event, item) => {
              onChange(item);
              setSelectedValBal({
                amount:
                  (
                    Number(item?.amount?.amount) /
                    10 ** currency.coinDecimals
                  ).toFixed(2) || '',
                denom: item?.amount?.denom || '',
              });
            }}
            renderInput={(params) => (
              <TextField
                className="bg-[#FFFFFF1A]"
                {...params}
                required
                placeholder="Select validator"
                error={!!error}
                sx={autoCompleteTextFieldStyles}
              />
            )}
          />
        )}
      />
      <div className="error-box">
        <span
          className={
            !!errors.validator
              ? 'error-chip opacity-80'
              : 'error-chip opacity-0'
          }
        >
          {errors.validator?.message}
        </span>
      </div>

      <div
        className="mb-1 text-[12px] text-[#FFFFFF80] text-right cursor-pointer hover:underline underline-offset-2"
        onClick={setAmountValue}
      >
        {formatCoin(Number(selectedValBal?.amount), currency?.coinDenom)}
      </div>
      <div className="mb-2">
        <Controller
          name="amount"
          control={control}
          rules={{
            required: 'Amount is required',
            validate: (value) => {
              const amount = Number(value);
              if (isNaN(amount) || amount <= 0) return 'Invalid Amount';
              if (amount > Number(selectedValBal?.amount))
                return INSUFFICIENT_BALANCE;
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              className="bg-[#FFFFFF1A]"
              {...field}
              sx={{ ...textFieldStyles, ...{ mb: '0' } }}
              error={!!error}
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
        <div className="error-box">
          <span
            className={
              !!errors.amount ? 'error-chip opacity-80' : 'error-chip opacity-0'
            }
          >
            {errors.amount?.message}
          </span>
        </div>
      </div>

      <button className="create-txn-form-btn" type="submit">
        Add
      </button>
    </form>
  );
};

export default UnDelegate;
