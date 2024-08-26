import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AttachFunds from '../single-contract/AttachFunds';
import { SelectChangeEvent, TextField } from '@mui/material';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { customTransferTextFieldStyles } from '@/app/(routes)/transfers/styles';

interface UseExistingCodeID {
  chainID: string;
  chainName: string;
}

const UseExistingCodeLeft = (props: UseExistingCodeID) => {
  const { chainID, chainName } = props;
  const [check] = useState(false);
  const [attachFundType, setAttachFundType] = useState('no-funds');
  const { getDenomInfo } = useGetChainInfo();
  const { decimals, minimalDenom } = getDenomInfo(chainID);
  const [funds, setFunds] = useState<FundInfo[]>([
    {
      amount: '',
      denom: minimalDenom,
      decimals: decimals,
    },
  ]);
  const [fundsInput, setFundsInput] = useState('');
  const handleAttachFundTypeChange = (event: SelectChangeEvent<string>) => {
    setAttachFundType(event.target.value);
  };

  return (
    <div className="w-[50%] space-y-6">
      <div className="space-y-1">
        <p className="text-b1-light">Code ID</p>

        <TextField
          className="bg-transparent rounded-full border-[1px] border-[#ffffff80]"
          placeholder=""
          required
          fullWidth
          type="text"
          sx={{
            ...customTransferTextFieldStyles,
            '& .MuiOutlinedInput-root': {
              ...customTransferTextFieldStyles['& .MuiOutlinedInput-root'],
              paddingLeft: '2px',
            },
          }}
        />
      </div>
      <div className="space-y-1">
        <div className="flex w-full justify-between">
          <p className="text-b1-light">Admin Address</p>
          <div className="flex gap-1">
            {check ? (
              <Image
                src="/after-check.svg"
                width={20}
                height={20}
                alt="after-check-icon"
              />
            ) : (
              <Image
                src="/before-check.svg"
                width={20}
                height={20}
                alt="before-check-icon"
              />
            )}
            <p className="text-b1-light">Assign me</p>
          </div>
        </div>
        <TextField
          className="bg-transparent rounded-full border-[1px] border-[#ffffff80]"
          placeholder=""
          required
          fullWidth
          type="text"
          sx={{
            ...customTransferTextFieldStyles,
            '& .MuiOutlinedInput-root': {
              ...customTransferTextFieldStyles['& .MuiOutlinedInput-root'],
              paddingLeft: '2px',
            },
          }}
        />
      </div>
      <div className="space-y-1">
        <p className="text-b1-light">Label</p>
        <TextField
          className="bg-transparent rounded-full border-[1px] border-[#ffffff80]"
          placeholder=""
          required
          fullWidth
          type="text"
          sx={{
            ...customTransferTextFieldStyles,
            '& .MuiOutlinedInput-root': {
              ...customTransferTextFieldStyles['& .MuiOutlinedInput-root'],
              paddingLeft: '2px',
            },
          }}
        />
      </div>
      <div className="flex-1 overflow-y-scroll space-y-1">
        <div className="text-b1-light">Attach Funds</div>
        <AttachFunds
          handleAttachFundTypeChange={handleAttachFundTypeChange}
          attachFundType={attachFundType}
          chainName={chainName}
          funds={funds}
          setFunds={setFunds}
          fundsInputJson={fundsInput}
          setFundsInputJson={setFundsInput}
        />
      </div>
    </div>
  );
};

export default UseExistingCodeLeft;
