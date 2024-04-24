import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useContracts from '@/custom-hooks/useContracts';
import { queryContractInfo } from '@/store/features/cosmwasm/cosmwasmSlice';
import { TxStatus } from '@/types/enums';
import { CircularProgress, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { queryInputStyles } from '../styles';
import { setError } from '@/store/features/common/commonSlice';

interface QueryContractI {
  address: string;
  baseURLs: string[];
  chainID: string;
}

const QueryContract = (props: QueryContractI) => {
  const { address, baseURLs, chainID } = props;

  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const dispatch = useAppDispatch();
  const { getContractMessages, getQueryContract } = useContracts();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [queryText, setQueryText] = useState('');
  const [contractMessages, setContractMessages] = useState<string[]>([]);

  const queryOutput = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.query.queryOutput
  );
  const queryLoading = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.query.status
  );

  // ------------------------------------------------//
  // -----------------CHANGE HANDLERS----------------//
  // ------------------------------------------------//
  const handleQueryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setQueryText(e.target.value);
  };

  const handleSelectMessage = (msg: string) => {
    setQueryText(`{\n\t"${msg}": {}\n}`);
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(queryText);
      const formattedJSON = JSON.stringify(parsed, undefined, 4);
      setQueryText(formattedJSON);
      return true;
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      dispatch(
        setError({
          type: 'error',
          message: 'Invalid JSON input: ' + (error?.message || ''),
        })
      );
    }
    return false;
  };

  // --------------------------------------//
  // -----------------QUERY----------------//
  // --------------------------------------//
  const onQuery = () => {
    if (!queryText?.length) {
      dispatch(
        setError({
          type: 'error',
          message: 'Please enter query message',
        })
      );
      return;
    }
    if (!formatJSON()) {
      return;
    }

    dispatch(
      queryContractInfo({
        address,
        baseURLs,
        queryData: queryText,
        chainID,
        getQueryContract,
      })
    );
  };

  // ------------------------------------------//
  // ---------------SIDE EFFECT----------------//
  // ------------------------------------------//
  useEffect(() => {
    const fetchMessages = async () => {
      const { messages } = await getContractMessages({ address, baseURLs });
      setContractMessages(messages);
    };
    fetchMessages();
  }, [address]);

  return (
    <div className="flex gap-10">
      <div className="query-input-wrapper">
        <div className="space-y-4">
          <div className="font-medium">Suggested Messages:</div>
          <div className="flex gap-4 flex-wrap">
            {contractMessages?.map((msg) => (
              <div
                onClick={() => handleSelectMessage(msg)}
                key={msg}
                className="query-shortcut-msg"
              >
                {msg}
              </div>
            ))}
          </div>
        </div>
        <div className="query-input">
          <TextField
            value={queryText}
            name="queryField"
            placeholder={JSON.stringify({ test_query: {} }, undefined, 2)}
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
            sx={queryInputStyles}
          />
          <button
            onClick={onQuery}
            disabled={queryLoading === TxStatus.PENDING}
            className="primary-gradient query-btn"
          >
            {queryLoading === TxStatus.PENDING ? (
              <CircularProgress size={18} sx={{ color: 'white' }} />
            ) : (
              'Query'
            )}
          </button>
          <button
            type="button"
            onClick={formatJSON}
            className="format-json-btn"
          >
            Format JSON
          </button>
        </div>
      </div>
      <div className="query-output-box">
        <div className="qeury-output">
          <pre>{JSON.stringify(queryOutput, undefined, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default QueryContract;
