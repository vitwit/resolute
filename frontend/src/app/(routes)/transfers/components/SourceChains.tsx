import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import { CircularProgress, Paper } from '@mui/material';
import { shortenName } from '@/utils/util';

interface ChainOption {
  label: string;
  chainID: string;
  logoURI: string;
}

export default function ChainAutocomplete({
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

  const renderInput = (params: any) => (
    <TextField
      className="bg-[#171328] rounded-2xl drop-down"
      placeholder="Select"
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
          fontSize: '16px',
          fontWeight: 300,
          fontFamily: 'inter',
          textTransform: 'capitalize',
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
              background:
                'linear-gradient(178deg, #241B61 1.71%, #69448D 98.35%, #69448D 98.35%)',
              color: 'white',
              borderRadius: '12px',
              padding: 1,
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
      />
    </div>
  );
}
