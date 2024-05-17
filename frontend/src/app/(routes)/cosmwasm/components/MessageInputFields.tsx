import { TxStatus } from '@/types/enums';
import { CircularProgress } from '@mui/material';
import React from 'react';

const MessageInputFields = ({
  fields,
  handleChange,
  onQuery,
  queryLoading,
  isQuery,
}: {
  fields: MessageInputField[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  onQuery: () => void;
  queryLoading: TxStatus;
  isQuery: boolean;
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="bg-[#ffffff0D] rounded-2xl p-6 space-y-6">
        {fields.map((field, index) => (
          <div className="space-y-2" key={field.name}>
            <div className="flex justify-between items-center">
              <div className="text-[14px] font-medium">{field.name}</div>
            </div>
            <div className="space-y-6">
              <div className="message-input-wrapper">
                <input
                  className="message-input-field"
                  type="text"
                  placeholder={`Enter ${field.name}`}
                  value={field.value}
                  onChange={(e) => handleChange(e, index)}
                  autoFocus={true}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onQuery()}
        className="primary-gradient text-[12px] font-medium py-[6px] px-6 leading-[20px] rounded-lg h-10 w-20 flex-center-center self-end"
      >
        {queryLoading === TxStatus.PENDING ? (
          <CircularProgress size={18} sx={{ color: 'white' }} />
        ) : isQuery ? (
          'Query'
        ) : (
          'Execute'
        )}
      </button>
    </div>
  );
};

export default MessageInputFields;
