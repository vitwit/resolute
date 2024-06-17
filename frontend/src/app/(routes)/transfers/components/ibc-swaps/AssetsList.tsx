import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import { CircularProgress, Paper } from '@mui/material';
import { shortenName } from '@/utils/util';
import { AssetConfig } from '@/types/swaps';
import { customAutoCompleteStyles, customTextFieldStyles } from '../../styles';
import NoOptions from '@/components/common/NoOptions';

export default function AssetsAutocomplete({
  options,
  handleChange,
  selectedAsset,
  assetsLoading,
}: {
  options: AssetConfig[];
  handleChange: (option: AssetConfig | null) => void;
  selectedAsset: AssetConfig | null;
  assetsLoading: boolean;
}) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderOption = (props: any, option: AssetConfig) => (
    <li {...props} key={option.symbol + option.logoURI + option.denom}>
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
          <span className="font-extralight truncate text-[12px]">
            {shortenName(option.name, 20)}
          </span>
        </div>
      </div>
    </li>
  );

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderInput = (params: any) => (
    <TextField
      placeholder="Select Asset"
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
      getOptionLabel={(option: AssetConfig) => option.symbol}
      renderOption={renderOption}
      renderInput={renderInput}
      noOptionsText={<NoOptions text="No Assets" />}
      onChange={(_, newValue) => handleChange(newValue)}
      value={selectedAsset}
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
          {assetsLoading ? (
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
  );
}
