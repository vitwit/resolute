import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  getAllValidators,
  getDelegations,
} from '@/store/features/staking/stakeSlice';
import React, { useEffect, useState } from 'react';
import { Decimal } from '@cosmjs/math';
import { Controller, useForm } from 'react-hook-form';
import {
  Autocomplete,
  CircularProgress,
  Paper,
  TextField,
} from '@mui/material';
import { autoCompleteStyles, autoCompleteTextFieldStyles } from '../../styles';
import AddressField from '../AddressField';
import AmountInputField from '../AmountInputField';
import { TxStatus } from '@/types/enums';

interface UnDelegateProps {
  chainID: string;
  address: string;
  onUndelegate: (payload: Msg) => void;
  currency: Currency;
  baseURLs: string[];
  feeAmount: number;
}

export const getParsedAmount = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) return 0;
  return parsedAmount;
};

export const getFormattedAmount = (amount: string): string => {
  const parsedAmount = getParsedAmount(amount);
  if (parsedAmount < 0.01) return '< 0.01';
  return parsedAmount.toString();
};

const Undelegate = (props: UnDelegateProps) => {
  const { chainID, address, currency, onUndelegate, baseURLs } = props;
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { restURLs } = getChainInfo(chainID);
  const validators = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.validators
  );

  const delegations = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.delegations
  );

  const delegationsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.delegations.status
  );

  const validatorsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.validators.status
  );

  useEffect(() => {
    dispatch(getDelegations({ address, chainID, baseURLs: restURLs }));
    dispatch(
      getAllValidators({
        baseURLs: baseURLs,
        chainID,
      })
    );
  }, [chainID]);

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

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      amount: '',
      validator: null,
      delegator: address,
    },
  });

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
      const msgUnDelegate = {
        delegatorAddress: data.delegator,
        validatorAddress: data.validator?.value,
        amount: {
          amount: baseAmount,
          denom: currency?.coinMinimalDenom,
        },
      };

      onUndelegate({
        typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
        value: msgUnDelegate,
      });
    }
  };

  useEffect(() => {
    dispatch(
      getDelegations({
        baseURLs,
        chainID,
        address,
      })
    );
  }, [chainID]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between"
    >
      <div className="space-y-2">
        <div className="text-[14px] font-extralight">Delegator</div>
        <AddressField control={control} name={'delegator'} />
      </div>
      <div className="space-y-2 mt-12">
        <div className="text-[14px] font-extralight">Select Validator</div>
        <Controller
          name="validator"
          control={control}
          defaultValue={null}
          rules={{ required: 'Validator is required' }}
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
                setSelectedValBal({
                  amount:
                    (
                      Number(item?.amount?.amount) /
                      10 ** currency.coinDecimals
                    ).toFixed(6) || '',
                  denom: item?.amount?.denom || '',
                });
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
      <div className="space-y-2 mt-[14px]">
        <div className="flex justify-between text-[14px] font-extralight">
          <div>Enter Amount</div>
          {getValues('validator') ? (
            <div>
              {delegationsLoading === TxStatus.PENDING ? (
                <div className="flex-center-center gap-2">
                  <CircularProgress size={14} sx={{ color: 'white' }} />
                  <span className="italic">Fetching delegations</span>
                </div>
              ) : (
                <div>
                  Available to Undelegate:{' '}
                  <span>{getFormattedAmount(selectedValBal?.amount)}</span>{' '}
                  {currency.coinDenom}
                </div>
              )}
            </div>
          ) : null}
        </div>
        <div>
          <AmountInputField
            availableBalance={getParsedAmount(selectedValBal?.amount)}
            control={control}
            displayDenom={currency.coinDenom}
            feeAmount={0}
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

export default Undelegate;
