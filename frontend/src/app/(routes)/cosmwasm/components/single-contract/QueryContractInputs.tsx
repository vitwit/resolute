import { CircularProgress, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TxStatus } from '@/types/enums';
import { queryInputStyles } from '../../styles';
import MessageInputFields from './MessageInputFields';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import CustomButton from '@/components/common/CustomButton';

const QueryContractInputs = (props: QueryContractInputsI) => {
  const {
    contractMessageInputs,
    contractMessages,
    handleQueryChange,
    handleSelectMessage,
    handleSelectedMessageInputChange,
    messagesLoading,
    queryText,
    selectedMessage,
    onQuery,
    formatJSON,
    queryLoading,
    messageInputsLoading,
    messageInputsError,
    messagesError,
    contractAddress,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  const queryContract = () => {
    const messageInputs = messageInputFields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.value,
      }),
      {}
    );
    const queryInput = JSON.stringify(
      {
        [selectedMessage]: messageInputs,
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

  useEffect(() => {
    setMessageInputFields([]);
  }, [contractAddress]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-b1-light">
          Query Messages:
          {messagesLoading ? (
            <span className="italic ">
              Fetching messages<span className="dots-flashing"></span>{' '}
            </span>
          ) : contractMessages?.length ? null : (
            <span className=" italic"> No messages found</span>
          )}
        </div>
        <div className="flex gap-4 flex-wrap">
          {contractMessages?.map((msg) => (
            <div
              onClick={() => handleSelectMessage(msg)}
              key={msg}
              className={`selected-msgs ${selectedMessage === msg ? 'bg-[#ffffff14] border-transparent' : 'border-[#ffffff26]'}`}
            >
              {msg}
            </div>
          ))}
        </div>
      </div>
      {isJSONInput && messageInputsLoading ? (
        <div className="flex-center-center gap-4 py-7 italic font-light">
          <CircularProgress size={16} sx={{ color: 'white' }} />
          <span>Fetching message inputs</span>
          <span className="dots-flashing"></span>
        </div>
      ) : isJSONInput && contractMessageInputs?.length ? (
        <div className="space-y-4">
          <div className="text-b1-light">
            Suggested Inputs for{' '}
            <span className="font-bold">{selectedMessage}</span>:
          </div>
          <div className="flex gap-4 flex-wrap">
            {contractMessageInputs?.map((msg) => (
              <div
                onClick={() => handleSelectedMessageInputChange(msg)}
                key={msg}
                className="selected-msgs border-[#ffffff26]"
              >
                {msg}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex justify-between items-center">
        <div className="text-b1-light">
          {isJSONInput
            ? 'Enter query in JSON format:'
            : messageInputFields.length
              ? 'Enter field value to query:'
              : ''}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[#fffffff0] font-medium text-[14px]">
            JSON Input
          </div>
          <ToggleSwitch
            checked={isJSONInput}
            onChange={() => setIsJSONInput((prev) => !prev)}
          />
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
            className="primary-btn query-btn"
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
        <div className="flex-center-center py-6 text-red-400">
          Couldn&apos;t fetch message inputs, Please switch to JSON format
        </div>
      ) : !messageInputFields.length ? (
        <div>
          {selectedMessage?.length ? (
            <div className="bg-[#FFFFFF14] rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-[14px] font-medium">{selectedMessage}</div>
              </div>
              <CustomButton
                btnText="Query"
                btnLoading={queryLoading === TxStatus.PENDING}
                btnDisabled={queryLoading === TxStatus.PENDING}
                btnOnClick={() => onQuery(queryText)}
                btnType="button"
              />
            </div>
          ) : (
            <div className="flex-center-center py-6">
              {messagesError ? (
                <div className="text-red-400">
                  Couldn&apos;t fetch messages, Please switch to JSON format
                </div>
              ) : (
                <div className="text-center text-b1-light">- Select a message to query -</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <MessageInputFields
          fields={messageInputFields}
          handleChange={handleInputMessageChange}
          onQuery={queryContract}
          queryLoading={queryLoading}
          isQuery={true}
        />
      )}
    </div>
  );
};

export default QueryContractInputs;
