import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import { CircularProgress, Paper } from '@mui/material';
import { shortenName } from '@/utils/util';
import { ChainConfig } from '@/types/swaps';
import { customAutoCompleteStyles, customTextFieldStyles } from '../styles';

interface ChainOption {
  label: string;
  chainID: string;
  logoURI: string;
}

export default function ChainsList({
  options,
  handleChange,
  selectedChain,
  dataLoading,
}: {
  options: ChainConfig[];
  handleChange: (option: ChainOption | null) => void;
  selectedChain: ChainConfig | null;
  dataLoading: boolean;
}) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderOption = (props: any, option: ChainOption) => (
    <li {...props} key={option.chainID}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar
          src={option.logoURI}
          alt={option.label}
          sx={{ width: '24px', height: '24px' }}
        />
        <div className="flex flex-col">
          <span className="font-semibold truncate text-capitalize">
            {shortenName(option.label, 15)}
          </span>
          <span className="font-extralight truncate text-[12px]">
            {shortenName(option.chainID, 15)}
          </span>
        </div>
      </div>
    </li>
  );

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderInput = (params: any) => (
    <TextField
      placeholder="Select Network"
      {...params}
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <React.Fragment>
            {selectedChain && (
              <Avatar
                src={selectedChain.logoURI}
                alt={selectedChain.label}
                style={{ marginRight: 1 }}
                sx={{ width: '24px', height: '24px' }}
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
    <div>
      <Autocomplete
        disablePortal
        fullWidth
        id="chain-autocomplete"
        options={options}
        getOptionLabel={(option: ChainOption) => option.label}
        renderOption={renderOption}
        renderInput={renderInput}
        onChange={(_, newValue) => handleChange(newValue)}
        value={selectedChain}
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
        sx={{ ...customTextFieldStyles, ...customAutoCompleteStyles }}
      />
    </div>
  );
}
