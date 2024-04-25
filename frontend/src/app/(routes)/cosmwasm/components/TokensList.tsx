import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';
import { assetsDropDownStyle } from '../styles';

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
        className="bg-[#FFFFFF0D]"
        value={denom}
        label="Select Asset"
        onChange={handleSelectAsset}
        sx={assetsDropDownStyle}
        placeholder="Select Asset"
        fullWidth
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
