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
  Paper,
  TextField,
} from '@mui/material';
import React from 'react';

const ValidatorsAutoComplete = ({
  options,
  selectedOption,
  handleChange,
  dataLoading,
  name,
}: {
  options: ValidatorInfo[];
  selectedOption: ValidatorInfo | null;
  handleChange: (option: ValidatorInfo | null) => void;
  dataLoading: boolean;
  name: string;
}) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderOption = (props: any, option: ValidatorInfo) => (
    <li {...props} key={option.address}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
        startAdornment: (
          <React.Fragment>
            {selectedOption && (
              <ValidatorLogo
                height={24}
                width={24}
                identity={selectedOption.identity}
              />
            )}
            {params.InputProps.startAdornment}
          </React.Fragment>
        ),
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
      id="chain-autocomplete"
      options={options}
      getOptionLabel={(option: ValidatorInfo) => option.label}
      renderOption={renderOption}
      renderInput={renderInput}
      onChange={(_, newValue) => handleChange(newValue)}
      value={selectedOption}
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
