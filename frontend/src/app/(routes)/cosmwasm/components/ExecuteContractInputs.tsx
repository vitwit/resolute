import { CircularProgress, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { queryInputStyles } from '../styles';
import { TxStatus } from '@/types/enums';
import MessageInputFields from './MessageInputFields';

interface ExecuteContractInputsI {
  messagesLoading: boolean;
  executeMessages: string[];
  handleSelectMessage: (msg: string) => Promise<void>;
  selectedMessage: string;
  executeMessageInputs: string[];
  handleSelectedMessageInputChange: (value: string) => void;
  executeInput: string;
  handleExecuteInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onExecute: (input: string) => void;
  executionLoading: TxStatus;
  formatJSON: () => void;
  executeInputsLoading: boolean;
  executeInputsError: string;
  messagesError: string;
}

const ExecuteContractInputs = (props: ExecuteContractInputsI) => {
  const {
    messagesLoading,
    executeMessages,
    handleSelectMessage,
    executeMessageInputs,
    selectedMessage,
    handleSelectedMessageInputChange,
    executeInput,
    handleExecuteInputChange,
    onExecute,
    executionLoading,
    formatJSON,
    executeInputsError,
    executeInputsLoading,
    messagesError,
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

  const executeContract = (index: number) => {
    const executionInput = JSON.stringify(
      {
        [selectedMessage]: {
          [messageInputFields[index].name]: messageInputFields[index].value,
        },
      },
      undefined,
      2
    );
    console.log(executionInput);
    onExecute(executionInput);
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

  // ------------------------------------------//
  // ---------------SIDE EFFECT----------------//
  // ------------------------------------------//
  useEffect(() => {
    const inputFields: MessageInputField[] = [];
    executeMessageInputs.forEach((messageInput) => {
      inputFields.push({ name: messageInput, open: false, value: '' });
    });
    setMessageInputFields(inputFields);
  }, [executeMessageInputs]);

  return (
    <div className="query-input-wrapper">
      <div className="space-y-4">
        <div className="font-light">
          Suggested Messages:
          {messagesLoading ? (
            <span className="italic ">
              Fetching messages<span className="dots-flashing"></span>{' '}
            </span>
          ) : executeMessages?.length ? null : (
            <span className=" italic"> No messages found</span>
          )}
        </div>
        <div className="flex gap-4 flex-wrap">
          {executeMessages?.map((msg) => (
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
      {executeMessageInputs?.length ? (
        <div className="space-y-4">
          <div className="font-light">
            Suggested Inputs for{' '}
            <span className="font-bold">{selectedMessage}</span>:
          </div>
          <div className="flex gap-4 flex-wrap">
            {executeMessageInputs?.map((msg) => (
              <div
                onClick={() => handleSelectedMessageInputChange(msg)}
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
            ? 'Enter execution message in JSON format:'
            : messageInputFields.length
              ? 'Enter field value to execute:'
              : 'Execution Input:'}
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
            value={executeInput}
            name="queryField"
            placeholder={JSON.stringify({ test_query: {} }, undefined, 2)}
            onChange={handleExecuteInputChange}
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
            onClick={() => onExecute(executeInput)}
            disabled={executionLoading === TxStatus.PENDING}
            className="primary-gradient query-btn"
          >
            {executionLoading === TxStatus.PENDING ? (
              <CircularProgress size={18} sx={{ color: 'white' }} />
            ) : (
              'Execute'
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
      ) : executeInputsLoading ? (
        <div className="flex-center-center gap-4 py-6 italic font-light">
          <CircularProgress size={16} sx={{ color: 'white' }} />
          <span>Fetching message inputs</span>
          <span className="dots-flashing"></span>
        </div>
      ) : executeInputsError ? (
        <div className="flex-center-center py-6 text-red-400">
          Couldn&apos;t fetch message inputs, Please switch to JSON format
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
                onClick={() => onExecute(executeInput)}
                className="primary-gradient text-[12px] font-medium py-[6px] px-6 leading-[20px] rounded-lg h-10 w-20 flex-center-center"
              >
                {executionLoading === TxStatus.PENDING ? (
                  <CircularProgress size={18} sx={{ color: 'white' }} />
                ) : (
                  'Execute'
                )}
              </button>
            </div>
          ) : (
            <div className="flex-center-center py-6">
              {messagesError ? (
                <div className="text-red-400">
                  Couldn&apos;t fetch messages, Please switch to JSON format
                </div>
              ) : (
                <div className="text-center">
                  - Select a message to execute -
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <MessageInputFields
          fields={messageInputFields}
          handleChange={handleInputMessageChange}
          onQuery={executeContract}
          expandField={expandField}
          queryLoading={executionLoading}
        />
      )}
    </div>
  );
};

export default ExecuteContractInputs;
