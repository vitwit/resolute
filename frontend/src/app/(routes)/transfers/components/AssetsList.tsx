import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import { Paper } from '@mui/material';
import { shortenName } from '@/utils/util';

interface AssetOption {
  label: string;
  symbol: string;
  logoURI: string;
}

export default function AssetsAutocomplete({
  options,
  handleChange,
  selectedAsset,
}: {
  options: AssetOption[];
  handleChange: (option: AssetOption | null) => void;
  selectedAsset: AssetOption | null;
}) {
  const renderOption = (props: any, option: AssetOption) => (
    <li {...props} key={option.symbol}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar
          src={option.logoURI}
          alt={option.label}
          sx={{ width: '24px', height: '24px' }}
        />
        <div className="flex flex-col">
          <span className="font-semibold truncate">
            {shortenName(option.symbol, 15)}
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
            {selectedAsset && (
              <Avatar
                src={selectedAsset.logoURI}
                alt={selectedAsset.label}
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
      getOptionLabel={(option: AssetOption) => option.symbol}
      renderOption={renderOption}
      renderInput={renderInput}
      onChange={(_, newValue) => handleChange(newValue)}
      value={selectedAsset}
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
          {children}
        </Paper>
      )}
    />
  );
}
