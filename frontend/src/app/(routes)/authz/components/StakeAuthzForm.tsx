import React, { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import ExpirationField from './ExpirationField';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { expirationFieldStyles, multiSelectDropDownStyle } from '../styles';
import CustomRadioGroup from './CustomRadioGroup';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { getAllValidators } from '@/store/features/staking/stakeSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { Validator } from '@/types/staking';

const StakeAuthzForm = ({
  control,
  advanced,
  toggle,
  msg,
  selectedChains,
  selectedValidators,
  setSelectedValidators,
  isDenyList,
  setIsDenyList,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  control: Control<any, any>;
  advanced: boolean;
  toggle: () => void;
  msg: string;
  selectedChains: string[];
  selectedValidators: string[];
  setSelectedValidators: React.Dispatch<React.SetStateAction<string[]>>;
  isDenyList: boolean;
  setIsDenyList: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const chainID = selectedChains.length ? selectedChains[0] : '';
  const { getChainInfo } = useGetChainInfo();
  const { baseURL } = getChainInfo(chainID);
  const validators = useAppSelector(
    (state: RootState) => state.staking.chains?.[chainID]?.validators
  );
  const [data, setData] = useState<{ label: string; value: string }[]>([]);
  const [allValidators, setAllValidators] = useState<Record<string, Validator>>(
    {}
  );
  useEffect(() => {
    if (selectedChains.length === 1 && chainID) {
      dispatch(getAllValidators({ baseURL, chainID }));
    }
  }, [chainID]);

  useEffect(() => {
    if (selectedChains.length === 1 && validators) {
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
        if (!(msg.toLowerCase() === 'delegate' && validator.jailed)) {
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

  const onSelect = (value: boolean) => {
    setIsDenyList(value);
  };

  const handleChange = (e: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = e;
    setSelectedValidators(typeof value === 'string' ? value.split(',') : value);
  };

  useEffect(() => {
    setAllValidators({ ...validators?.active, ...validators?.inactive });
  }, [validators]);

  return (
    <div className="space-y-2">
      <div className="space-y-6">
        <ExpirationField control={control} msg={msg} />
        {selectedChains.length === 1 && advanced && (
          <>
            <Controller
              name={msg + '.max_tokens'}
              control={control}
              rules={{
                validate: (value) => {
                  const amount = Number(value);
                  if (value?.length && (isNaN(amount) || amount <= 0))
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
            <div>
              <CustomRadioGroup onSelect={onSelect} isDenyList={isDenyList} />
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    color: '#ffffffc4',
                    fontWeight: 200,
                    '& .Mui-focused': {
                      color: '#ffffffc4 !important',
                    },
                  }}
                  shrink={false}
                >
                  Select Validators
                </InputLabel>
                <Select
                  className="w-full bg-[#FFFFFF1A]"
                  required
                  multiple
                  label="Select Validators"
                  value={selectedValidators}
                  onChange={(e) => handleChange(e)}
                  renderValue={() => <></>}
                  sx={multiSelectDropDownStyle}
                >
                  {data.map((a, index) => (
                    <MenuItem key={index} value={a.value}>
                      {a.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="mt-4 flex flex-wrap gap-4">
                {selectedValidators.map((valAddress) => (
                  <div key={valAddress} className="moniker-name-chip">
                    {allValidators?.[valAddress]?.description?.moniker || '-'}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {selectedChains.length === 1 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={toggle}
            className="text-[14px] leading-[20px] underline underline-offset-2 tracking-[0.56px]"
          >
            Customize
          </button>
        </div>
      )}
    </div>
  );
};

export default StakeAuthzForm;
