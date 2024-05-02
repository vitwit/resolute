import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useContracts from '@/custom-hooks/useContracts';
import { queryContractInfo } from '@/store/features/cosmwasm/cosmwasmSlice';
import React, { useEffect, useState } from 'react';
import { setError } from '@/store/features/common/commonSlice';
import QueryContractInputs from './QueryContractInputs';

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
  const {
    getContractMessages,
    getQueryContract,
    getContractMessageInputs,
    messagesLoading,
    messageInputsLoading,
    messageInputsError,
    messagesError,
  } = useContracts();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [queryText, setQueryText] = useState('');
  const [contractMessages, setContractMessages] = useState<string[]>([]);
  const [contractMessageInputs, setContractMessageInputs] = useState<string[]>(
    []
  );
  const [selectedMessage, setSelectedMessage] = useState('');

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

  const handleSelectMessage = async (msg: string) => {
    setQueryText(`{\n\t"${msg}": {}\n}`);
    setSelectedMessage(msg);
    const { messages } = await getContractMessageInputs({
      address,
      baseURLs,
      queryMsg: { [msg]: {} },
    });
    setContractMessageInputs(messages);
  };

  const hanldeSelectedMessageInputChange = (value: string) => {
    setQueryText(
      JSON.stringify(
        {
          [selectedMessage]: {
            [value]: '',
          },
        },
        undefined,
        2
      )
    );
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
  const onQuery = (queryInput: string) => {
    if (!queryInput?.length) {
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
        queryData: queryInput,
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
    <div className="grid grid-cols-2 gap-10">
      <QueryContractInputs
        contractMessageInputs={contractMessageInputs}
        contractMessages={contractMessages}
        formatJSON={formatJSON}
        handleQueryChange={handleQueryChange}
        handleSelectMessage={handleSelectMessage}
        hanldeSelectedMessageInputChange={hanldeSelectedMessageInputChange}
        messagesLoading={messagesLoading}
        onQuery={onQuery}
        queryLoading={queryLoading}
        queryText={queryText}
        selectedMessage={selectedMessage}
        messageInputsLoading={messageInputsLoading}
        messageInputsError={messageInputsError}
        messagesError={messagesError}
      />
      <div className="query-output-box overflow-y-scroll">
        <div className="qeury-output">
          <pre>{JSON.stringify(queryOutput, undefined, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default QueryContract;
