import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Decimal } from '@cosmjs/math';
import {
  Autocomplete,
  CircularProgress,
  Paper,
  TextField,
} from '@mui/material';
import { autoCompleteStyles, autoCompleteTextFieldStyles } from '../../styles';
import {
  getAllValidators,
  getDelegations,
} from '@/store/features/staking/stakeSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import AddressField from '../AddressField';
import { TxStatus } from '@/types/enums';
import { getFormattedAmount, getParsedAmount } from './Undelegate';
import AmountInputField from '../AmountInputField';

interface RedelegateProps {
  chainID: string;
  address: string;
  onRedelegate: (payload: Msg) => void;
  currency: Currency;
  baseURLs: string[];
  feeAmount: number;
}

interface StakeBal {
  amount: string;
  denom: string;
}

interface ValidatorOption {
  label: string;
  value: string;
  amount: StakeBal;
}

const isValueExists = (
  valueToCheck: string,
  valsData: ValidatorOption[]
): boolean => {
  return valsData.some((destVal) => destVal.value === valueToCheck);
};

const Redelegate: React.FC<RedelegateProps> = (props) => {
  const { chainID, address, onRedelegate, currency, baseURLs } = props;
  const { getChainInfo } = useGetChainInfo();
  const { restURLs } = getChainInfo(chainID);
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      amount: '',
      validatorSrcAddress: null,
      validatorDstAddress: null,
      delegator: address,
    },
  });

  const validators = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.validators
  );

  const delegations = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.delegations
  );

  const delegationsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.delegations.status
  );

  const validatorsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.validators.status
  );

  useEffect(() => {
    dispatch(getDelegations({ address, chainID, baseURLs: restURLs }));
  }, []);

  const [selectedValBal, setSelectedValBal] = useState<StakeBal>({
    amount: '',
    denom: '',
  });

  const [data, setData] = useState<ValidatorOption[]>([]);
  const [destVals, setDestVals] = useState<ValidatorOption[]>([]);

  useEffect(() => {
    const srcValsData = [];
    const destValsData: ValidatorOption[] = [];

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

          srcValsData.push(temp);
        }

        const temp = {
          label: validator.description.moniker,
          value: validators.activeSorted[i],
          amount: del.balance,
        };
        if (!isValueExists(temp.value, destValsData)) destValsData.push(temp);
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

            srcValsData.push(temp);
          }

          const temp = {
            label: validator.description.moniker,
            value: validators.activeSorted[i],
            amount: del.balance,
          };
          if (!isValueExists(temp.value, destValsData)) destValsData.push(temp);
        }
      }
    }

    setData(srcValsData);
    setDestVals(destValsData);
  }, [validators]);

  const onSubmit = (data: {
    amount: string;
    validatorSrcAddress: null | {
      value: string;
    };
    validatorDstAddress: null | {
      value: string;
    };
    delegator: string;
  }) => {
    if (data?.validatorSrcAddress && data?.validatorDstAddress) {
      const baseAmount = Decimal.fromUserInput(
        data.amount.toString(),
        Number(currency?.coinDecimals)
      ).atomics;
      const msgRedelegate = {
        delegatorAddress: data.delegator,
        validatorSrcAddress: data.validatorSrcAddress?.value,
        validatorDstAddress: data.validatorDstAddress?.value,
        amount: {
          amount: baseAmount,
          denom: currency?.coinMinimalDenom,
        },
      };

      onRedelegate({
        typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
        value: msgRedelegate,
      });
    }
  };

  useEffect(() => {
    dispatch(getDelegations({ address, chainID, baseURLs: restURLs }));
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
        <div className="text-[14px] font-extralight">Delegator</div>
        <AddressField control={control} name={'delegator'} />
      </div>

      <div className="space-y-2 mt-12">
        <div className="text-[14px] font-extralight">Select Validator</div>
        <div className="flex gap-6 w-full">
          <div className="w-full">
            <Controller
              name="validatorSrcAddress"
              control={control}
              defaultValue={null}
              rules={{ required: 'Source Validator is required' }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
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
                      placeholder="Source Val"
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
                  !!errors.validatorSrcAddress
                    ? 'error-chip opacity-80'
                    : 'error-chip opacity-0'
                }
              >
                {errors.validatorSrcAddress?.message}
              </span>
            </div>
          </div>
          <div className="w-full">
            <Controller
              name="validatorDstAddress"
              control={control}
              defaultValue={null}
              rules={{ required: 'Destination Validator is required' }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
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
                      className="bg-[#FFFFFF0D]"
                      {...params}
                      required
                      placeholder="Destination Val"
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
                  !!errors.validatorDstAddress
                    ? 'error-chip opacity-80'
                    : 'error-chip opacity-0'
                }
              >
                {errors.validatorDstAddress?.message}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-[14px]">
        <div className="flex justify-between text-[14px] font-extralight">
          <div>Enter Amount</div>
          {getValues('validatorSrcAddress') ? (
            <div>
              {delegationsLoading === TxStatus.PENDING ? (
                <div className="flex-center-center gap-2">
                  <CircularProgress size={14} sx={{ color: 'white' }} />
                  <span className="italic">Fetching delegations</span>
                </div>
              ) : (
                <div>
                  Available to Redelegate:{' '}
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

export default Redelegate;
