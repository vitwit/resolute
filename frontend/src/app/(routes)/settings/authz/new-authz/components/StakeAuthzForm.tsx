import React from 'react';
import { Control, Controller } from 'react-hook-form';
import ExpirationField from './ExpirationField';
import { TextField } from '@mui/material';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { expirationFieldStyles } from '../../../styles';
import CustomRadioGroup from './CustomRadioGroup';
import ValidatorAutoComplete from './ValidatorAutoComplete';

interface StakeAuthzFormProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  control: Control<any, any>;
  advanced: boolean;
  toggle: () => void;
  msg: string;
  selectedChains: string[];
  setSelectedValidators: React.Dispatch<React.SetStateAction<string[]>>;
  isDenyList: boolean;
  setIsDenyList: React.Dispatch<React.SetStateAction<boolean>>;
  maxTokensError: string;
}

const StakeAuthzForm = ({
  control,
  advanced,
  toggle,
  msg,
  selectedChains,
  setSelectedValidators,
  isDenyList,
  setIsDenyList,
  maxTokensError,
}: StakeAuthzFormProps) => {
  const nameToChainIDs = useAppSelector((state) => state.common.nameToChainIDs);
  const chainID = selectedChains.length
    ? nameToChainIDs?.[selectedChains[0]]
    : '';
  const onSelect = (value: boolean) => {
    setIsDenyList(value);
  };

  const handleSelectValidators = (data: string[]) => {
    setSelectedValidators(data);
  };

  return (
    <div className="space-y-2">
      <div className="space-y-6">
        <ExpirationField control={control} msg={msg} />
        {selectedChains.length === 1 && advanced && (
          <>
            <div>
              <Controller
                name={msg + '.max_tokens'}
                control={control}
                rules={{
                  validate: (value) => {
                    const amount = Number(value);
                    if (value?.length && (Number.isNaN(amount) || amount <= 0))
                      return 'Invalid Amount';
                  },
                }}
                render={({ field }) => (
                  <TextField
                    className="rounded-2xl"
                    {...field}
                    fullWidth
                    required={false}
                    size="small"
                    autoFocus={true}
                    placeholder="Max Tokens (Optional)"
                    sx={expirationFieldStyles}
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
              <div className="error-box">
                <span
                  className={
                    maxTokensError?.length
                      ? 'error-chip opacity-80'
                      : 'error-chip opacity-0'
                  }
                >
                  {maxTokensError || ''}
                </span>
              </div>
            </div>
            <CustomRadioGroup onSelect={onSelect} isDenyList={isDenyList} />
            <ValidatorAutoComplete
              chainID={chainID}
              handleSelectValidators={handleSelectValidators}
            />
          </>
        )}
      </div>
      {selectedChains.length === 1 && (
        <div className="flex justify-end">
          <button type="button" onClick={toggle} className="secondary-btn">
            Customize
          </button>
        </div>
      )}
    </div>
  );
};

export default StakeAuthzForm;
