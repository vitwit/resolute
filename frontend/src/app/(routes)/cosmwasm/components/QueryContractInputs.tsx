import { CircularProgress, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { queryInputStyles } from '../styles';
import { TxStatus } from '@/types/enums';
import MessageInputFields from './MessageInputFields';

const QueryContractInputs = (props: QueryContractInputsI) => {
  const {
    contractMessageInputs,
    contractMessages,
    handleQueryChange,
    handleSelectMessage,
    hanldeSelectedMessageInputChange,
    messagesLoading,
    queryText,
    selectedMessage,
    onQuery,
    formatJSON,
    queryLoading,
    messageInputsLoading,
    messageInputsError,
  } = props;

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [isJSONInput, setIsJSONInput] = useState(false);
  const [messageInputFields, setMessageInputFields] = useState<
    MessageInputField[]
  >([]);

  // ------------------------------------------------//
  // -----------------CHANGE HANDLERS----------------//
  // ------------------------------------------------//
  const handleInputMessageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const input = e.target.value;
    const updatedFields = messageInputFields.map((value, key) => {
      if (index === key) {
        value.value = input;
      }
      return value;
    });
    setMessageInputFields(updatedFields);
  };

  const expandField = (index: number) => {
    const updatedFields = messageInputFields.map((field, i) => {
      if (i === index) {
        return { ...field, open: !field.open };
      } else {
        return { ...field, open: false };
      }
    });

    setMessageInputFields(updatedFields);
  };

  const queryContract = (index: number) => {
    const queryInput = JSON.stringify(
      {
        [selectedMessage]: {
          [messageInputFields[index].name]: messageInputFields[index].value,
        },
      },
      undefined,
      2
    );
    onQuery(queryInput);
  };

  // ------------------------------------------//
  // ---------------SIDE EFFECT----------------//
  // ------------------------------------------//
  useEffect(() => {
    const inputFields: MessageInputField[] = [];
    contractMessageInputs.forEach((messageInput) => {
      inputFields.push({ name: messageInput, open: false, value: '' });
    });
    setMessageInputFields(inputFields);
  }, [contractMessageInputs]);

  return (
    <div className="query-input-wrapper">
      <div className="space-y-4">
        <div className="font-light">
          Suggested Messages:
          {messagesLoading ? (
            <span className="italic ">
              Fetching messages<span className="dots-flashing"></span>{' '}
            </span>
          ) : contractMessages?.length ? null : (
            <span className=" italic">No messages found</span>
          )}
        </div>
        <div className="flex gap-4 flex-wrap">
          {contractMessages?.map((msg) => (
            <div
              onClick={() => handleSelectMessage(msg)}
              key={msg}
              className={`query-shortcut-msg ${!isJSONInput && selectedMessage === msg ? 'primary-gradient' : ''}`}
            >
              {msg}
            </div>
          ))}
        </div>
      </div>
      {contractMessageInputs?.length ? (
        <div className="space-y-4">
          <div className="font-light">
            Suggested Inputs for{' '}
            <span className="font-bold">{selectedMessage}</span>:
          </div>
          <div className="flex gap-4 flex-wrap">
            {contractMessageInputs?.map((msg) => (
              <div
                onClick={() => hanldeSelectedMessageInputChange(msg)}
                key={msg}
                className="query-shortcut-msg"
              >
                {msg}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex justify-between items-center font-extralight">
        <div>
          {isJSONInput
            ? 'Enter query in JSON format:'
            : messageInputFields.length
              ? 'Enter field value to query:'
              : 'Query:'}
        </div>
        <div className="change-input-type-btn-wrapper">
          <button
            className="change-input-type-btn w-[104px]"
            onClick={() => setIsJSONInput((prev) => !prev)}
          >
            {isJSONInput ? 'Enter Fields' : 'JSON Format'}
          </button>
        </div>
      </div>
      {isJSONInput ? (
        <div className="query-input">
          <TextField
            value={queryText}
            name="queryField"
            placeholder={JSON.stringify({ test_query: {} }, undefined, 2)}
            onChange={handleQueryChange}
            fullWidth
            multiline
            rows={10}
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
            onClick={() => onQuery(queryText)}
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
      ) : messageInputsLoading ? (
        <div className="flex-center-center gap-4 py-6 italic font-light">
          <CircularProgress size={16} sx={{ color: 'white' }} />
          <span>Fetching message inputs</span>
          <span className="dots-flashing"></span>
        </div>
      ) : messageInputsError ? (
        <div>
          Couldn&apos;t fetch message input, Please switch to JSON format
        </div>
      ) : !messageInputFields.length ? (
        <div>
          {selectedMessage?.length ? (
            <div className="bg-[#ffffff14] rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-[14px]">{selectedMessage}</div>
              </div>
              <button
                type="button"
                onClick={() => onQuery(queryText)}
                className="primary-gradient text-[12px] font-medium py-[6px] px-6 leading-[20px] rounded-lg h-10 w-20 flex-center-center"
              >
                {queryLoading === TxStatus.PENDING ? (
                  <CircularProgress size={18} sx={{ color: 'white' }} />
                ) : (
                  'Query'
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-10">
              - Select a message to query -
            </div>
          )}
        </div>
      ) : (
        <MessageInputFields
          fields={messageInputFields}
          handleChange={handleInputMessageChange}
          onQuery={queryContract}
          expandField={expandField}
          queryLoading={queryLoading}
        />
      )}
    </div>
  );
};

export default QueryContractInputs;
