import useContracts from '@/custom-hooks/useContracts';
import { customMUITextFieldStyles } from '@/utils/commonStyles';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

const QueryContract = ({
  address,
  baseURLs,
  chainID,
  rpcURLs,
}: {
  address: string;
  baseURLs: string[];
  chainID: string;
  rpcURLs: string[];
}) => {
  const {
    getContractMessages,
    messagesLoading,
    getQueryContractOutput,
    queryLoading,
    queryError,
  } = useContracts();
  const [contractMessages, setContractMessages] = useState<string[]>([]);
  const [queryOutput, setQueryOutput] = useState('');
  const [queryText, setQueryText] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const { messages } = await getContractMessages({ address, baseURLs });
      setContractMessages(messages);
    };
    fetchMessages();
  }, [address]);

  const handleQueryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setQueryText(e.target.value);
  };

  const handleSelectMessage = (msg: string) => {
    setQueryText(`{\n\t"${msg}": {}\n}`);
  };

  const onQuery = async () => {
    const { data } = await getQueryContractOutput({
      address,
      baseURLs,
      queryData: queryText,
    });
    setQueryOutput(data.data);
  };

  return (
    <div className="flex gap-10">
      <div className="query-field flex flex-col gap-4">
        <div className="flex gap-4 flex-wrap">
          {contractMessages?.map((msg) => (
            <div
              onClick={() => handleSelectMessage(msg)}
              key={msg}
              className="px-4 py-2 rounded-2xl bg-[#FFFFFF14] cursor-pointer hover:bg-[#ffffff26]"
            >
              {msg}
            </div>
          ))}
        </div>
        <div className="relative flex-1 border-[1px] rounded-2xl border-[#ffffff1e] hover:border-[#ffffff50]">
          <TextField
            value={queryText}
            name="queryField"
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
            onClick={onQuery}
            className="primary-gradient h-10 rounded-lg px-3 py-[6px] absolute bottom-6 right-6"
          >
            Query
          </button>
        </div>
      </div>
      <div className="query-output-box">
        <div className=" border-[1px] border-[#ffffff1e] h-full rounded-2xl p-2 overflow-x-scroll overflow-y-scroll">
          <pre>{JSON.stringify(queryOutput, undefined, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default QueryContract;
