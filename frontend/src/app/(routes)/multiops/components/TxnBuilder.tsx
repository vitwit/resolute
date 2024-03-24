'use client';
import React, { useState } from 'react';
import SelectTransactionType from './SelectTransactionType';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { MULTISIG_TX_TYPES } from '@/utils/constants';
import { selectTxnStyles } from '../styles';

const TxnBuilder = () => {
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);
  const [msgType, setMsgType] = useState('Send');
  const [message, setMessges] = useState<Msg[]>([]);
  const onSelect = (value: boolean) => {
    setIsFileUpload(value);
  };
  const handleMsgTypeChange = (event: SelectChangeEvent<string>) => {
    setMsgType(event.target.value);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="text-[18px]">Create Transaction</div>
          {/* TODO: Add description */}
          <div className="text-[14px] font-extralight">
            Multiops allows you to create single transaction with multiple
            messages of same or different type.
          </div>
        </div>
        <div className="border-b-[1px] border-[#ffffff33]">
          <SelectTransactionType
            onSelect={onSelect}
            isFileUpload={isFileUpload}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex-1 flex gap-2">
          <div className="w-1/3 pr-4">
            {isFileUpload ? (
              <div className="flex flex-col h-full">
                <SelectMsgType
                  handleMsgTypeChange={handleMsgTypeChange}
                  msgType={msgType}
                />
                <div className="flex-1 bg-[#ffffff0D] rounded-lg"></div>
              </div>
            ) : (
              <div>
                <SelectMsgType
                  handleMsgTypeChange={handleMsgTypeChange}
                  msgType={msgType}
                />
              </div>
            )}
          </div>
          <div className="h-full w-[1px] bg-[#ffffff33]"></div>
          <div className="flex-1"></div>
        </div>
        <div>
          <button
            type="button"
            className="w-full text-[12px] font-medium primary-gradient rounded-lg h-10 flex justify-center items-center"
          >
            Execute Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default TxnBuilder;

export const SelectMsgType = ({
  handleMsgTypeChange,
  msgType,
}: {
  handleMsgTypeChange: (event: SelectChangeEvent<string>) => void;
  msgType: string;
}) => {
  return (
    <div className="space-y-2">
      <div className="text-[14px] font-extralight">Select transaction type</div>
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
          className="bg-[#FFFFFF0D]"
          id="tx-type"
          value={msgType}
          label="Select Transaction"
          onChange={handleMsgTypeChange}
          sx={selectTxnStyles}
        >
          <MenuItem value={MULTISIG_TX_TYPES.send}>Send</MenuItem>
          <MenuItem value={MULTISIG_TX_TYPES.delegate}>Delegate</MenuItem>
          <MenuItem value={MULTISIG_TX_TYPES.redelegate}>Redelegate</MenuItem>
          <MenuItem value={MULTISIG_TX_TYPES.undelegate}>Undelegate</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
