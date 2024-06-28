import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import { TextField, InputAdornment } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, UseFormSetValue } from 'react-hook-form';
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

const RedelegateMessage = ({
  control,
  index,
  remove,
  setValue,
  chainID,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  control: any;
  index: number;
  remove: (index: number) => void;
  setValue: UseFormSetValue<TxnBuilderForm>;
  chainID: string;
}) => {
  const dispatch = useAppDispatch();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { restURLs: baseURLs, address } = getChainInfo(chainID);
  const { decimals: coinDecimals, displayDenom } = getDenomInfo(chainID);
  const { getValidatorsForUndelegation, getValidators } = useStaking();
  const { delegatedValidators, delegationsData } = getValidatorsForUndelegation(
    { chainID }
  );
  const { validatorsList } = getValidators({ chainID });
  const [selectedOption, setSelectedOption] = useState<ValidatorOption | null>(
    null
  );
  const [selectedDestValidator, setSelectedDestValidator] =
    useState<ValidatorOption | null>(null);
  const [amountForUndelegation, setAmountForUndelegation] = useState<
    { amount: string; denom: string } | undefined
  >();
  const validatorsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.validators.status
  );
  const handleChange = (option: ValidatorOption | null) => {
    setValue(`msgs.${index}.sourceValidator`, option?.address || '');
    setSelectedOption(option);
    updateAmount(option?.address);
  };

  const handleDestValidatorChange = (option: ValidatorOption | null) => {
    setValue(`msgs.${index}.destValidator`, option?.address || '');
    setSelectedDestValidator(option);
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

  useEffect(() => {
    if (chainID) {
      dispatch(getAllValidators({ chainID, baseURLs }));
      dispatch(getDelegations({ chainID, baseURLs, address }));
    }
  }, []);

  return (
    <div className="bg-[#FFFFFF05] rounded-2xl space-y-2">
      <div className="bg-[#FFFFFF05] rounded-2xl px-6 py-4 flex items-center justify-between">
        <div className="text-b1">Redelegate</div>
        <div className="secondary-btn" onClick={() => remove(index)}>
          Remove
        </div>
      </div>
      <div className="flex items-center gap-6 px-6">
        <div className="flex-1 space-y-2">
          <div className="text-b1-light">Select Source Validator</div>
          <CustomAutoComplete
            dataLoading={validatorsLoading === TxStatus.PENDING}
            handleChange={handleChange}
            options={delegatedValidators}
            selectedOption={selectedOption}
            name="Select Validator"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-b1-light">Select Destination Validator</div>
          <CustomAutoComplete
            dataLoading={validatorsLoading === TxStatus.PENDING}
            handleChange={handleDestValidatorChange}
            options={validatorsList}
            selectedOption={selectedDestValidator}
            name="Select Validator"
          />
        </div>
      </div>
      <div className="flex items-center gap-6 px-6 pb-6">
        <div className="flex-1 space-y-2">
          <div className="text-b1-light">Enter Amount</div>
          <Controller
            name={`msgs.${index}.amount`}
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
                          {'Available for Redelegation :'}{' '}
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
  );
};

export default RedelegateMessage;
