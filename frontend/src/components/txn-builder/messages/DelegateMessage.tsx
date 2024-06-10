import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import { TextField, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import CustomAutoComplete from '../components/CustomAutoComplete';
import useStaking from '@/custom-hooks/txn-builder/useStaking';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getAllValidators } from '@/store/features/staking/stakeSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { TxStatus } from '@/types/enums';

const DelegateMessage = ({
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
  const { getChainInfo } = useGetChainInfo();
  const { restURLs: baseURLs } = getChainInfo(chainID);
  const { getValidators } = useStaking();
  const { validatorsList } = getValidators({ chainID });
  const [selectedOption, setSelectedOption] = useState<ValidatorOption | null>(
    null
  );
  const validatorsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.validators.status
  );
  const handleChange = (option: ValidatorOption | null) => {
    setValue(`msgs.${index}.validator`, option?.address || '');
    setSelectedOption(option);
  };

  useEffect(() => {
    if (chainID) {
      dispatch(getAllValidators({ chainID, baseURLs }));
    }
  }, []);

  return (
    <div className="bg-[#FFFFFF05] rounded-2xl space-y-2">
      <div className="bg-[#FFFFFF05] rounded-2xl px-6 py-4 flex items-center justify-between">
        <div className="text-b1">Delegate</div>
        <div className="secondary-btn" onClick={() => remove(index)}>
          Remove
        </div>
      </div>
      <div className="flex items-center gap-6 px-6 pb-6">
        <div className="flex-1 space-y-2">
          <div className="text-b1-light">Select Validator</div>
          <CustomAutoComplete
            dataLoading={validatorsLoading === TxStatus.PENDING}
            handleChange={handleChange}
            options={validatorsList}
            selectedOption={selectedOption}
          />
        </div>
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
                }}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default DelegateMessage;
