import useStaking from '@/custom-hooks/txn-builder/useStaking';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import React, { useEffect, useState } from 'react';
import ValidatorLogo from '@/app/(routes)/staking/components/ValidatorLogo';
import {
  customAutoCompleteStyles,
  customTextFieldStyles,
} from '@/app/(routes)/transfers/styles';
import NoOptions from '@/components/common/NoOptions';
import { shortenName } from '@/utils/util';
import {
  Autocomplete,
  CircularProgress,
  Paper,
  TextField,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';
import { getAllValidators } from '@/store/features/staking/stakeSlice';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { REMOVE_ICON_OUTLINED } from '@/constants/image-names';
import Image from 'next/image';

const listItemStyle = css`
  &:hover {
    background-color: #ffffff09 !important;
  }
`;

const ValidatorAutoComplete = ({
  chainID,
  handleSelectValidators,
}: {
  chainID: string;
  handleSelectValidators: (data: string[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { restURLs: baseURLs } = getChainInfo(chainID);
  const { getValidators } = useStaking();
  const { validatorsList } = getValidators({ chainID });
  const [selectedOptions, setSelectedOptions] = useState<ValidatorOption[]>([]);
  const validatorsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.validators.status
  );

  const handleValidatorChange = (
    options: ValidatorOption[] | ValidatorOption | null
  ) => {
    const updatedValidators = Array.isArray(options)
      ? options
      : options
        ? [options]
        : [];
    setSelectedOptions(updatedValidators);
    const validators = updatedValidators.map((validator) => validator.address);
    handleSelectValidators(validators);
  };

  const removeValidator = (validatorToRemove: ValidatorOption) => {
    const updatedValidators = selectedOptions.filter(
      (option) => option.address !== validatorToRemove.address
    );
    setSelectedOptions(updatedValidators);
    const validators = updatedValidators.map((validator) => validator.address);
    handleSelectValidators(validators);
  };

  useEffect(() => {
    if (chainID?.length) dispatch(getAllValidators({ chainID, baseURLs }));
  }, []);

  return (
    <div className="space-y-4">
      <CustomAutoComplete
        dataLoading={validatorsLoading === TxStatus.PENDING}
        handleChange={handleValidatorChange}
        options={validatorsList}
        selectedOptions={selectedOptions}
        name="Select Validators"
        emptyText="No Validators"
        multiple
      />
      <div className="space-y-2 flex items-center flex-wrap gap-2">
        {selectedOptions.map((option) => (
          <div
            key={option.address}
            className="selected-validator"
            style={{ marginTop: '0px' }}
          >
            <ValidatorLogo height={18} width={18} identity={option.identity} />
            <div className="text-[14px]">{shortenName(option.label, 15)}</div>
            <button type="button" onClick={() => removeValidator(option)}>
              <Image
                src={REMOVE_ICON_OUTLINED}
                width={16}
                height={16}
                alt="remove"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidatorAutoComplete;

const CustomAutoComplete = ({
  options,
  selectedOptions,
  handleChange,
  dataLoading,
  name,
  emptyText,
  multiple,
}: {
  options: ValidatorOption[];
  selectedOptions: ValidatorOption[];
  handleChange: (options: ValidatorOption[] | ValidatorOption | null) => void;
  dataLoading: boolean;
  name: string;
  emptyText: string;
  multiple?: boolean;
}) => {
  const isOptionSelected = (option: ValidatorOption) =>
    selectedOptions.some((selected) => selected.address === option.address);

  const handleOptionClick = (option: ValidatorOption) => {
    if (isOptionSelected(option)) {
      handleChange(
        selectedOptions.filter(
          (selected) => selected.address !== option.address
        )
      );
    } else {
      handleChange(multiple ? [...selectedOptions, option] : [option]);
    }
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderOption = (props: any, option: ValidatorOption) => (
    <li
      {...props}
      key={option.address}
      css={listItemStyle}
      style={{
        backgroundColor: isOptionSelected(option) ? '#ffffff10' : 'inherit',
        color: isOptionSelected(option) ? 'white' : 'inherit',
        cursor: 'pointer',
      }}
      onClick={() => handleOptionClick(option)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          paddingTop: '2px',
        }}
      >
        <ValidatorLogo height={24} width={24} identity={option.identity} />
        <div className="flex flex-col">
          <span className="font-semibold truncate">
            {shortenName(option.label, 15)}
          </span>
        </div>
      </div>
    </li>
  );

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderInput = (params: any) => (
    <TextField
      placeholder={name}
      {...params}
      InputProps={{
        ...params.InputProps,
        startAdornment: <React.Fragment></React.Fragment>,
      }}
      sx={{
        '& .MuiInputBase-input': {
          color: 'white',
          fontSize: '14px',
          fontWeight: 300,
          fontFamily: 'Libre Franklin',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiSvgIcon-root': {
          color: 'white',
        },
      }}
    />
  );

  return (
    <Autocomplete
      disablePortal
      fullWidth
      id="validators-autocomplete"
      options={options}
      getOptionLabel={(option: ValidatorOption) => option.label}
      renderOption={renderOption}
      renderInput={renderInput}
      noOptionsText={<NoOptions text={emptyText} />}
      onChange={(_, newValue) => handleChange(newValue)}
      value={selectedOptions}
      multiple={multiple}
      PaperComponent={({ children }) => (
        <Paper
          style={{
            background: '#FFFFFF14',
            color: 'white',
            borderRadius: '16px',
            backdropFilter: 'blur(15px)',
            marginTop: '8px',
          }}
        >
          {options?.length ? (
            <>{children}</>
          ) : dataLoading ? (
            <div className="flex justify-center items-center p-4">
              <CircularProgress color="inherit" size={20} />
            </div>
          ) : (
            <NoOptions text={emptyText} />
          )}
        </Paper>
      )}
      sx={{ ...customTextFieldStyles, ...customAutoCompleteStyles }}
    />
  );
};
