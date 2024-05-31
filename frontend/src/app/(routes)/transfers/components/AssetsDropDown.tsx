import { Autocomplete, Avatar, Paper, TextField } from '@mui/material';
import React from 'react';
import { customAutoCompleteStyles, customTextFieldStyles } from '../styles';

const AssetsDropDown = ({
  sortedAssets = [],
  selectedAsset,
  handleAssetChange,
}: {
  sortedAssets: ParsedAsset[];
  selectedAsset: ParsedAsset | null;
  handleAssetChange: (option: ParsedAsset | null) => void;
}) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderOption = (props: any, option: ParsedAsset) => (
    <li {...props} key={option.chainID + option.denom}>
      <div className="flex justify-between items-center px-1 py-2">
        <div className="flex gap-2">
          <div>
            <Avatar
              src={option.chainLogoURL}
              alt={option.displayDenom}
              sx={{
                width: '24px',
                height: '24px',
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 items-center text-[14px] leading-[24px]">
              <div>{option.balance}</div>
              <div>{option.displayDenom}</div>
            </div>
            <div className="secondary-text !text-[12px]">
              on <span className="capitalize">{option.chainName}</span>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </li>
  );

  const renderInput = (params: any) => (
    <TextField
      placeholder="Select Asset"
      {...params}
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <React.Fragment>
            {selectedAsset && (
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div>
                    <Avatar
                      src={selectedAsset.chainLogoURL}
                      alt={selectedAsset.displayDenom}
                      sx={{
                        width: '24px',
                        height: '24px',
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 items-center text-[14px] leading-[24px] text-white">
                      <div>{selectedAsset.balance}</div>
                      <div>{selectedAsset.displayDenom}</div>
                    </div>
                    <div className="secondary-text !text-[12px]">
                      on{' '}
                      <span className="capitalize">
                        {selectedAsset.chainName}
                      </span>
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            )}
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
      options={sortedAssets}
      getOptionLabel={(option: ParsedAsset) => option.displayDenom}
      renderOption={renderOption}
      renderInput={renderInput}
      onChange={(_, newValue) => handleAssetChange(newValue)}
      value={selectedAsset || null}
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
          {children}
        </Paper>
      )}
      sx={{ ...customTextFieldStyles, ...customAutoCompleteStyles }}
    />
  );
};

export default AssetsDropDown;
