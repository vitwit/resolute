/** @jsxImportSource @emotion/react */

import ValidatorLogo from '@/app/(routes)/staking/components/ValidatorLogo';
import {
  customAutoCompleteStyles,
  customTextFieldStyles,
} from '@/app/(routes)/transfers/styles';
import { ValidatorInfo } from '@/types/staking';
import { shortenName } from '@/utils/util';
import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
} from '@mui/material';
import React from 'react';
import { css } from '@emotion/react';

const listItemStyle = css`
  &:hover {
    background-color: #ffffff09 !important;
  }
`;

const ValidatorsAutoComplete = ({
  options,
  selectedValidator,
  handleChange,
  dataLoading,
  name,
}: {
  options: ValidatorInfo[];
  selectedValidator: ValidatorInfo | null;
  handleChange: (option: ValidatorInfo | null) => void;
  dataLoading: boolean;
  name: string;
}) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderOption = (props: any, option: ValidatorInfo) => (
    <li
      {...props}
      key={option.address}
      style={{
        width: '100%',
        paddingTop: '8px',
        paddingBottom: '8px',
        color: '#ffffffad !important',
      }}
      css={listItemStyle}
    >
      <div className="flex items-start gap-2 w-full px-1">
        <ValidatorLogo height={24} width={24} identity={option.identity} />
        <div className="flex items-center justify-between flex-1">
          <div>
            <div className="text-b1 truncate">
              {shortenName(option.label, 30)}
            </div>
            <div className="secondary-text">
              {shortenName(option?.description, 80)}
            </div>
          </div>
          <div className="text-[#ffffff80] text-[12px] font-extralight">
            {option.commission}% Commission
          </div>
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
        startAdornment: (
          <React.Fragment>
            {selectedValidator && (
              <ValidatorLogo
                height={24}
                width={24}
                identity={selectedValidator.identity}
              />
            )}
            {params.InputProps.startAdornment}
          </React.Fragment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <div className="flex items-center gap-2">
              {selectedValidator && (
                <div className="secondary-text !leading-[21px] mr-2">
                  <span className="capitalize">
                    {selectedValidator.commission}% Commission
                  </span>
                </div>
              )}
              {params.InputProps.endAdornment}
            </div>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiInputBase-input': {
          color: '#ffffffad',
          fontSize: '14px',
          fontWeight: 400,
          fontFamily: 'Libre Franklin',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiSvgIcon-root': {
          color: '#ffffffad',
        },
      }}
    />
  );

  return (
    <Autocomplete
      disablePortal
      fullWidth
      id="chain-autocomplete"
      options={options}
      getOptionLabel={(option: ValidatorInfo) => option.label}
      renderOption={renderOption}
      renderInput={renderInput}
      onChange={(_, newValue) => handleChange(newValue)}
      value={selectedValidator}
      PaperComponent={({ children }) => (
        <Paper
          style={{
            background: '#FFFFFF14',
            color: 'white',
            borderRadius: '16px',
            backdropFilter: 'blur(15px)',
            marginTop: '8px',
            overflow: 'hidden',
          }}
        >
          {dataLoading ? (
            <div className="flex justify-center items-center p-4">
              <CircularProgress color="inherit" size={20} />
            </div>
          ) : (
            children
          )}
        </Paper>
      )}
      sx={{
        ...customTextFieldStyles,
        ...customAutoCompleteStyles,
      }}
    />
  );
};

export default ValidatorsAutoComplete;
