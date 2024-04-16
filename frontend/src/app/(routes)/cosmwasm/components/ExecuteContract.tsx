import useContracts from '@/custom-hooks/useContracts';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

const ExecuteContract = ({
  address,
  baseURLs,
  chainID,
  rpcURLs,
  walletAddress,
}: {
  address: string;
  baseURLs: string[];
  chainID: string;
  rpcURLs: string[];
  walletAddress: string;
}) => {
  const { getExecutionOutput } = useContracts();
  //   const [contractMessages, setContractMessages] = useState<string[]>([]);
  const [executionOutput, setExecutionOutput] = useState('');
  const [executeInput, setExecuteInput] = useState('');

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
    // setExecutionOutput(data.data);
    // getExecuteMessages({
    //   chainID,
    //   contractAddress: address,
    //   rpcURLs: rpcURLs,
    // });
  };

  return (
    <div className="flex gap-10">
      <div className="query-field flex flex-col gap-4">
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
      <div className="query-output-box">
        <div className=" border-[1px] border-[#ffffff1e] h-full rounded-2xl p-2 overflow-x-scroll overflow-y-scroll">
          <pre>{JSON.stringify(executionOutput, undefined, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default ExecuteContract;
