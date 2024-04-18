import useContracts from '@/custom-hooks/useContracts';
import { SelectChangeEvent, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AttachFunds from './AttachFunds';

const ExecuteContract = ({
  address,
  baseURLs,
  chainID,
  rpcURLs,
  walletAddress,
  chainName,
}: {
  address: string;
  baseURLs: string[];
  chainID: string;
  rpcURLs: string[];
  walletAddress: string;
  chainName: string;
}) => {
  const { getExecutionOutput, getChainAssets } = useContracts();
  //   const [contractMessages, setContractMessages] = useState<string[]>([]);
  const [executionOutput, setExecutionOutput] = useState('');
  const [executeInput, setExecuteInput] = useState('');
  const [attachFundType, setAttachFundType] = useState('no-funds');

  //   useEffect(() => {
  //     const fetchMessages = async () => {
  //       const { messages } = await getContractMessages({ address, baseURLs });
  //       setContractMessages(messages);
  //     };
  //     fetchMessages();
  //   }, [address]);

  const handleQueryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setExecuteInput(e.target.value);
  };

  //   const handleSelectMessage = (msg: string) => {
  //     setQueryText(`{\n\t"${msg}": {}\n}`);
  //   };

  const onExecute = async () => {
    await getExecutionOutput({
      chainID,
      contractAddress: address,
      msgs: executeInput,
      rpcURLs,
      walletAddress,
    });
    // setExecutionOutput();
    // getExecuteMessages({
    //   chainID,
    //   contractAddress: address,
    //   rpcURLs: rpcURLs,
    // });
  };

  const handleAttachFundTypeChange = (event: SelectChangeEvent<string>) => {
    setAttachFundType(event.target.value);
  };

  return (
    <div className="flex gap-10">
      <div className="execute-field flex flex-col gap-4">
        {/* <div className="flex gap-4 flex-wrap">
          {contractMessages?.map((msg) => (
            <div
              onClick={() => handleSelectMessage(msg)}
              key={msg}
              className="px-4 py-2 rounded-2xl bg-[#FFFFFF14] cursor-pointer hover:bg-[#ffffff26]"
            >
              {msg}
            </div>
          ))}
        </div> */}
        <div className="relative flex-1 border-[1px] rounded-2xl border-[#ffffff1e] hover:border-[#ffffff50]">
          <TextField
            value={executeInput}
            name="executeInputsField"
            onChange={handleQueryChange}
            fullWidth
            multiline
            rows={7}
            InputProps={{
              sx: {
                input: {
                  color: 'white',
                  fontSize: '14px',
                  padding: 2,
                },
              },
            }}
            sx={{
              '& .MuiTypography-body1': {
                color: 'white',
                fontSize: '12px',
                fontWeight: 200,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiOutlinedInput-root': {
                border: 'none',
                borderRadius: '16px',
                color: 'white',
              },
              '& .Mui-focused': {
                border: 'none',
                borderRadius: '16px',
              },
            }}
          />
          <button
            onClick={onExecute}
            className="primary-gradient h-10 rounded-lg px-3 py-[6px] absolute bottom-6 right-6"
          >
            Execute
          </button>
        </div>
      </div>
      <div className="execute-output-box">
        <div className="border-b-[1px] border-[#ffffff1e] pb-4 space-y-2">
          <div className="text-[18px] font-bold">Attach Funds</div>
          {/* TODO: Update the dummy description */}
          <div className="leading-[18px] text-[12px] font-extralight">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Necessitatibus fuga consectetur reiciendis fugit suscipit ab.
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll">
          <AttachFunds
            handleAttachFundTypeChange={handleAttachFundTypeChange}
            attachFundType={attachFundType}
            chainID={chainID}
            chainName={chainName}
          />
        </div>
      </div>
    </div>
  );
};

export default ExecuteContract;
