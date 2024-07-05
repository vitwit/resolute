import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import { TextField, InputAdornment } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import CustomAutoComplete from '../components/CustomAutoComplete';
import useStaking from '@/custom-hooks/txn-builder/useStaking';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  getAllValidators,
  getDelegations,
} from '@/store/features/staking/stakeSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { TxStatus } from '@/types/enums';
import { formatCoin } from '@/utils/util';
import { Decimal } from '@cosmjs/math';
import FileUpload from '../components/FileUpload';

interface UnDelegateProps {
  chainID: string;
  fromAddress: string;
  onUndelegate: (payload: Msg) => void;
  currency: Currency;
  cancelAddMsg: () => void;
}

const UndelegateForm = (props: UnDelegateProps) => {
  const { fromAddress, chainID, currency, onUndelegate, cancelAddMsg } = props;
  const dispatch = useAppDispatch();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { restURLs: baseURLs } = getChainInfo(chainID);
  const { decimals: coinDecimals, displayDenom } = getDenomInfo(chainID);
  const { getValidatorsForUndelegation } = useStaking();
  const { delegatedValidators, delegationsData } = getValidatorsForUndelegation(
    { chainID }
  );
  const [selectedOption, setSelectedOption] = useState<ValidatorOption | null>(
    null
  );
  const [amountForUndelegation, setAmountForUndelegation] = useState<
    { amount: string; denom: string } | undefined
  >();
  const validatorsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.validators.status
  );
  const { handleSubmit, control, setValue, reset } = useForm({
    defaultValues: {
      amount: 0,
      validator: '',
      delegator: fromAddress,
    },
  });
  const handleValidatorChange = (option: ValidatorOption | null) => {
    setValue('validator', option?.address || '');
    setSelectedOption(option);
    updateAmount(option?.address);
  };

  const updateAmount = (address: string | undefined) => {
    if (address) {
      const item = delegationsData.find(
        (item) => item.validatorAddress === address
      );
      setAmountForUndelegation({
        amount: (Number(item?.amount) / 10 ** coinDecimals).toFixed(6) || '',
        denom: item?.denom || '',
      });
    } else {
      setAmountForUndelegation(undefined);
    }
  };

  const onSubmit = (data: {
    amount: number;
    validator: string;
    delegator: string;
  }) => {
    if (data.validator) {
      const baseAmount = Decimal.fromUserInput(
        data.amount.toString(),
        Number(currency?.coinDecimals)
      ).atomics;
      const msgUnDelegate = {
        delegatorAddress: data.delegator,
        validatorAddress: data.validator,
        amount: {
          amount: baseAmount,
          denom: currency?.coinMinimalDenom,
        },
      };

      onUndelegate({
        typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
        value: msgUnDelegate,
      });
      reset();
      handleValidatorChange(null);
    }
  };

  const handleAddMsgs = (msgs: Msg[]) => {
    for (const msg of msgs) {
      onUndelegate(msg);
    }
  };

  useEffect(() => {
    if (chainID) {
      dispatch(getAllValidators({ chainID, baseURLs }));
      dispatch(getDelegations({ chainID, baseURLs, address: fromAddress }));
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between h-full"
    >
      <div className="space-y-6">
        <div className="bg-[#FFFFFF05] rounded-2xl space-y-2">
          <div className="bg-[#FFFFFF05] rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="text-b1">Undelegate</div>
            <button
              className="secondary-btn"
              onClick={cancelAddMsg}
              type="button"
            >
              Cancel
            </button>
          </div>
          <div className="space-y-6 px-6 pb-6">
            <div className="flex-1 space-y-2">
              <div className="text-b1-light">Select Validator</div>
              <CustomAutoComplete
                dataLoading={validatorsLoading === TxStatus.PENDING}
                handleChange={handleValidatorChange}
                options={delegatedValidators}
                selectedOption={selectedOption}
                name="Select Validator"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-b1-light">Amount</div>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                    {...field}
                    sx={{
                      ...customMUITextFieldStyles,
                    }}
                    placeholder="Enter amount"
                    fullWidth
                    InputProps={{
                      sx: {
                        input: {
                          color: 'white',
                          fontSize: '14px',
                          padding: 2,
                        },
                      },
                      endAdornment: (
                        <div className="text-small-light">
                          {amountForUndelegation ? (
                            <InputAdornment
                              position="start"
                              sx={{ color: '#ffffff80' }}
                            >
                              {'Staked :'}{' '}
                              {formatCoin(
                                Number(amountForUndelegation?.amount),
                                displayDenom
                              )}{' '}
                            </InputAdornment>
                          ) : null}
                        </div>
                      ),
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <FileUpload
          fromAddress={fromAddress}
          msgType="Undelegate"
          onUpload={handleAddMsgs}
        />
      </div>
      <div>
        <button className="primary-btn w-full">Add</button>
      </div>
    </form>
  );
};

export default UndelegateForm;
