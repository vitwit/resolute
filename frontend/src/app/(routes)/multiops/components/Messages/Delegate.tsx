import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Decimal } from '@cosmjs/math';
import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
} from '@mui/material';
import { formatCoin } from '@/utils/util';
import {
  autoCompleteStyles,
  autoCompleteTextFieldStyles,
  textFieldStyles,
} from '../../styles';
import { INSUFFICIENT_BALANCE } from '@/utils/errors';
import { getAllValidators } from '@/store/features/staking/stakeSlice';
import AddressField from '../AddressField';
import AmountInputField from '../AmountInputField';
import { TxStatus } from '@/types/enums';

interface DelegateProps {
  chainID: string;
  address: string;
  onDelegate: (payload: Msg) => void;
  currency: Currency;
  availableBalance: number;
  baseURLs: string[];
  feeAmount: number;
}

const Delegate: React.FC<DelegateProps> = (props) => {
  const dispatch = useAppDispatch();
  const {
    chainID,
    address,
    onDelegate,
    currency,
    availableBalance,
    baseURLs,
    feeAmount,
  } = props;
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      amount: '',
      validator: null,
      delegator: address,
    },
  });
  const validators = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.validators
  );
  const [data, setData] = useState<{ label: string; value: string }[]>([]);
  const validatorsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.validators.status
  );

  useEffect(() => {
    if (validators) {
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
      setData(data);
    }
  }, [validators]);

  const onSubmit = (data: {
    amount: string;
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
      const msgDelegate = {
        delegatorAddress: data.delegator,
        validatorAddress: data.validator?.value,
        amount: {
          amount: baseAmount,
          denom: currency?.coinMinimalDenom,
        },
      };

      onDelegate({
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: msgDelegate,
      });
    }
  };

  useEffect(() => {
    dispatch(
      getAllValidators({
        baseURLs: baseURLs,
        chainID,
      })
    );
  }, [chainID]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between"
    >
      <div className="space-y-2">
        <div className="text-[14px] font-extralight">Address</div>
        <AddressField control={control} name={'delegator'} />
      </div>

      <div className="space-y-2 mt-12">
        <div className="text-[14px] font-extralight">Select Validator</div>
        <div>
          <Controller
            name="validator"
            control={control}
            defaultValue={null}
            rules={{ required: 'Validator is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                disablePortal
                value={value}
                sx={{ ...autoCompleteStyles }}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                options={data}
                onChange={(event, item) => {
                  onChange(item);
                }}
                renderInput={(params) => (
                  <TextField
                    className="bg-[#FFFFFF0D]"
                    {...params}
                    required
                    placeholder="Select validator"
                    error={!!error}
                    sx={autoCompleteTextFieldStyles}
                  />
                )}
                PaperComponent={({ children }) => (
                  <Paper
                    style={{
                      background:
                        'linear-gradient(178deg, #241B61 1.71%, #69448D 98.35%, #69448D 98.35%)',
                      color: 'white',
                      borderRadius: '8px',
                      padding: 1,
                    }}
                  >
                    {validatorsLoading === TxStatus.PENDING ? (
                      <div className="flex justify-center items-center gap-2 p-4">
                        <CircularProgress color="inherit" size={16} />
                        <div className="font-light italic text-[14px]">
                          Fetching validators{' '}
                          <span className="dots-flashing"></span>{' '}
                        </div>
                      </div>
                    ) : (
                      children
                    )}
                  </Paper>
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
        </div>
      </div>

      <div className="space-y-2 mt-[14px]">
        <div className="flex justify-between text-[14px] font-extralight">
          <div>Enter Amount</div>
          <div>
            Available Balance: <span>{availableBalance}</span>{' '}
            {currency.coinDenom}
          </div>
        </div>
        <div>
          <AmountInputField
            availableBalance={availableBalance}
            control={control}
            displayDenom={currency.coinDenom}
            feeAmount={feeAmount}
            setValue={setValue}
          />
          <div className="error-box">
            <span
              className={
                !!errors.amount
                  ? 'error-chip opacity-80'
                  : 'error-chip opacity-0'
              }
            >
              {errors.amount?.message}
            </span>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="mt-[14px] w-full text-[12px] font-medium primary-gradient rounded-lg h-8 flex justify-center items-center"
      >
        Add
      </button>
    </form>
  );
};

export default Delegate;
