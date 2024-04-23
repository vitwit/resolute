import {
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import React from 'react';
import { customTextFieldStyles, assetsDropDownStyle } from '../styles';
import Image from 'next/image';

interface SelectFundsI {
  onAddFund: (fund: FundInfo) => void;
  funds: FundInfo[];
  assetsList: AssetInfo[];
  onDelete: (index: number) => void;
  setFunds: (value: React.SetStateAction<FundInfo[]>) => void;
}

const SelectFunds = (props: SelectFundsI) => {
  const { onAddFund, funds, assetsList, onDelete, setFunds } = props;
  const handleAddFund = () => {
    onAddFund({
      amount: '',
      denom: '',
      decimals: 1,
    });
  };
  return (
    <div className="space-y-6">
      {funds.map((fund, index) => (
        <Fund
          key={index}
          assetsList={assetsList}
          fund={fund}
          onDelete={() => onDelete(index)}
          index={index}
          funds={funds}
          setFunds={setFunds}
        />
      ))}
      <div className="flex justify-end">
        <button
          className="primary-gradient rounded-lg px-3 py-[6px] font-medium leading-[20px] text-[12px]"
          onClick={handleAddFund}
        >
          Add More
        </button>
      </div>
    </div>
  );
};

export default SelectFunds;

const Fund = ({
  assetsList,
  fund,
  onDelete,
  index,
  funds,
  setFunds,
}: {
  assetsList: AssetInfo[];
  fund: FundInfo;
  onDelete: () => void;
  index: number;
  funds: FundInfo[];
  setFunds: (value: React.SetStateAction<FundInfo[]>) => void;
}) => {
  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const input = e.target.value;
    const newFunds = funds.map((value, key) => {
      if (index === key) {
        if (/^-?\d*\.?\d*$/.test(input)) {
          if ((input.match(/\./g) || []).length <= 1) {
            value.amount = input;
          }
        }
      }
      return value;
    });
    setFunds(newFunds);
  };

  return (
    <div className="flex gap-6">
      <TokensList
        assetsList={assetsList}
        denom={fund.denom}
        index={index}
        funds={funds}
        setFunds={setFunds}
      />
      <AmountInputField
        amount={fund.amount}
        handleChange={handleAmountChange}
        onDelete={onDelete}
        index={index}
      />
    </div>
  );
};

const TokensList = ({
  assetsList,
  denom,
  index,
  funds,
  setFunds,
}: {
  assetsList: AssetInfo[];
  denom: string;
  index: number;
  funds: FundInfo[];
  setFunds: (value: React.SetStateAction<FundInfo[]>) => void;
}) => {
  // const [selectedAsset, setSelectedAsset] = useState<string>(denom);
  const handleSelectAsset = (e: SelectChangeEvent<string>) => {
    const selectedValue = e.target.value;
    const selected = assetsList.find(
      (asset) => asset.coinMinimalDenom === selectedValue
    );
    // if (selected) setSelectedAsset(selected.coinMinimalDenom);

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

const AmountInputField = ({
  amount,
  handleChange,
  onDelete,
  index,
}: {
  amount: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => void;
  onDelete: () => void;
  index: number;
}) => {
  return (
    <TextField
      name="sourceAmount"
      className="rounded-lg bg-[#ffffff0D]"
      fullWidth
      required={false}
      size="small"
      autoFocus={true}
      placeholder="Enter Amount"
      sx={customTextFieldStyles}
      value={amount}
      InputProps={{
        sx: {
          input: {
            color: 'white !important',
            fontSize: '14px',
            padding: 2,
          },
        },
        endAdornment: (
          <InputAdornment position="start">
            <div className="cursor-pointer" onClick={onDelete}>
              <Image src="/delete-icon.svg" width={24} height={24} alt="" />
            </div>
          </InputAdornment>
        ),
      }}
      onChange={(e) => handleChange(e, index)}
    />
  );
};
