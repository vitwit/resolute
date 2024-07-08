/** @jsxImportSource @emotion/react */

import {
  Autocomplete,
  Avatar,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import React from 'react';
import { customAutoCompleteStyles, customTextFieldStyles } from '../../styles';
import NoOptions from '@/components/common/NoOptions';
import CustomLoader from '@/components/common/CustomLoader';
import { css } from '@emotion/react';

const listItemStyle = css`
  &:hover {
    background-color: #ffffff09 !important;
  }
`;

interface AssetsDropDownProps {
  sortedAssets: ParsedAsset[];
  selectedAsset: ParsedAsset | null;
  handleAssetChange: (option: ParsedAsset | null) => void;
  loading: boolean;
}

const AssetsDropDown: React.FC<AssetsDropDownProps> = ({
  sortedAssets = [],
  selectedAsset,
  handleAssetChange,
  loading,
}) => {
  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: ParsedAsset
  ) => (
    <li {...props} key={option.chainID + option.denom} css={listItemStyle}>
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
              <div>
                {String(option.balance).split('.')[0]}
                {option.balance > 0 ? (
                  <span className="text-[12px]">
                    .{String(option.balance).split('.')[1]}
                  </span>
                ) : null}
              </div>
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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderInput = (params: any) => (
    <TextField
      placeholder="Select Asset"
      {...params}
      InputProps={{
        ...params.InputProps,
        startAdornment: selectedAsset && (
          <InputAdornment position="start">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Avatar
                  src={selectedAsset.chainLogoURL}
                  alt={selectedAsset.displayDenom}
                  sx={{
                    width: '24px',
                    height: '24px',
                    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                  }}
                />
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 items-center text-[14px] leading-[24px] text-white">
                    <div>{selectedAsset.balance}</div>
                  </div>
                </div>
              </div>
            </div>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <div className="flex items-center gap-2">
              {selectedAsset && (
                <div className="secondary-text !text-[12px] text-white mr-2">
                  on{' '}
                  <span className="capitalize">{selectedAsset.chainName}</span>
                </div>
              )}
              {params.InputProps.endAdornment}
            </div>
          </InputAdornment>
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
      noOptionsText={<NoOptions text="No Assets" />}
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
          {sortedAssets?.length ? (
            children
          ) : (
            <>
              {loading ? (
                <div className="flex justify-center items-center p-4">
                  <CustomLoader
                    loadingText="Fetching Balances"
                    textStyles="italic"
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center p-4">
                  No Assets
                </div>
              )}
            </>
          )}
        </Paper>
      )}
      sx={{ ...customTextFieldStyles, ...customAutoCompleteStyles }}
    />
  );
};

export default AssetsDropDown;
