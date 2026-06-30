import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';
import { customSelectStyles } from '@/utils/commonStyles';

interface TokensListI {
  assetsList: AssetInfo[];
  denom: string;
  index: number;
  funds: FundInfo[];
  setFunds: (value: React.SetStateAction<FundInfo[]>) => void;
}

const TokensList = (props: TokensListI) => {
  const { assetsList, denom, index, funds, setFunds } = props;
  const handleSelectAsset = (e: SelectChangeEvent<string>) => {
    const selectedValue = e.target.value;
    const selected = assetsList.find(
      (asset) => asset.coinMinimalDenom === selectedValue
    );

    const newFunds = funds.map((value, key) => {
      if (index === key) {
        value.denom = selectedValue;
        value.decimals = selected?.decimals || 1;
      }
      return value;
    });
    setFunds(newFunds);
  };
  return (
    <div className="w-[25%]">
      <Select
        className="bg-transparent border-[1px] border-[#ffffff14]"
        value={denom}
        label="Select Asset"
        onChange={handleSelectAsset}
        sx={customSelectStyles}
        placeholder="Select Asset"
        fullWidth
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: '#FFFFFF14',
              backdropFilter: 'blur(15px)',
              color: '#fffffff0',
              borderRadius: '16px',
              marginTop: '8px',
            },
          },
        }}
      >
        {assetsList.map((asset) => (
          <MenuItem key={asset.coinMinimalDenom} value={asset.coinMinimalDenom}>
            {asset.symbol}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
export default TokensList;
