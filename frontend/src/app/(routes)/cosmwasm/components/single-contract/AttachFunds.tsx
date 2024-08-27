import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import useContracts from '@/custom-hooks/useContracts';
import SelectFunds from './SelectFunds';
import ProvideFundsJson from './ProvideFundsJson';
import { customSelectStyles } from '@/utils/commonStyles';

interface AttachFundsI {
  handleAttachFundTypeChange: (event: SelectChangeEvent<string>) => void;
  attachFundType: string;
  chainName: string;
  setFunds: (value: React.SetStateAction<FundInfo[]>) => void;
  funds: FundInfo[];
  fundsInputJson: string;
  setFundsInputJson: (value: string) => void;
}

const AttachFunds = (props: AttachFundsI) => {
  const {
    handleAttachFundTypeChange,
    attachFundType,
    chainName,
    funds,
    setFunds,
    fundsInputJson,
    setFundsInputJson,
  } = props;
  const onAddFund = (fund: FundInfo) => {
    setFunds((prev) => [...prev, fund]);
  };
  const { getChainAssets } = useContracts();
  const { assetsList } = getChainAssets(chainName);
  const onDelete = (index: number) => {
    if (index === 0) return;
    const newFunds = funds.filter((_, i) => i !== index);
    setFunds(newFunds);
  };
  return (
    <div className="space-y-6">
      <FormControl
        fullWidth
        sx={{
          '& .MuiFormLabel-root': {
            display: 'none',
          },
        }}
      >
        <InputLabel className="text-white" id="tx-type">
          Select Transaction
        </InputLabel>
        <Select
          labelId="tx-type"
          className="bg-transparent border-[1px] border-[#ffffff14]"
          id="tx-type"
          value={attachFundType}
          label="Select Transaction"
          onChange={handleAttachFundTypeChange}
          sx={{
            ...customSelectStyles,
            '& .MuiSelect-select': {
              color: '#fffffff0',
            },
          }}
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
          <MenuItem value={'no-funds'}>No Funds Attached</MenuItem>
          <MenuItem value={'select'}>Select Assets</MenuItem>
          <MenuItem value={'json'}>Provide Assets List</MenuItem>
        </Select>
      </FormControl>
      {attachFundType === 'select' ? (
        <SelectFunds
          onAddFund={onAddFund}
          funds={funds}
          assetsList={assetsList}
          onDelete={onDelete}
          setFunds={setFunds}
        />
      ) : null}
      {attachFundType === 'json' ? (
        <ProvideFundsJson
          fundsInput={fundsInputJson}
          setFundsInput={setFundsInputJson}
        />
      ) : null}
    </div>
  );
};

export default AttachFunds;
