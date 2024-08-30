import { TxStatus } from '@/types/enums';
import { customTextFieldStyles } from '@/utils/commonStyles';
import { CircularProgress, TextField } from '@mui/material';
import React from 'react';

const MessageInputFields = ({
  fields,
  handleChange,
  onQuery,
  queryLoading,
  isQuery,
}: {
  fields: MessageInputField[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => void;
  onQuery: () => void;
  queryLoading: TxStatus;
  isQuery: boolean;
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="border-[1px] rounded-2xl border-[#ffffff1e] p-6 space-y-6">
        {fields.map((field, index) => (
          <div className="space-y-2" key={field.name}>
            <div className="flex justify-between items-center">
              <div className="text-[12px] font-light text-[#ffffff80]">
                {field.name}
              </div>
            </div>
            <div className="space-y-6">
              <div className="message-input-wrapper">
                <TextField
                  className="message-input-field"
                  type="text"
                  placeholder={`Enter ${field.name}`}
                  value={field.value}
                  onChange={(e) => handleChange(e, index)}
                  autoFocus={true}
                  sx={customTextFieldStyles}
                  fullWidth
                />
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onQuery()}
            className="primary-btn"
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
      </div>
    </div>
  );
};

export default MessageInputFields;
