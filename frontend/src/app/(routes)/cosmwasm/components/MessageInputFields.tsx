import { TxStatus } from '@/types/enums';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const MessageInputFields = ({
  fields,
  handleChange,
  onQuery,
  expandField,
  queryLoading,
}: {
  fields: MessageInputField[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  onQuery: (index: number) => void;
  expandField: (index: number) => void;
  queryLoading: TxStatus;
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {fields.map((field, index) => (
        <div
          key={field.name}
          className="bg-[#ffffff14] rounded-2xl p-6 space-y-6"
        >
          <div className="flex justify-between items-center">
            <div className="text-[14px]">{field.name}</div>
            <Image
              onClick={() => expandField(index)}
              className="cursor-pointer"
              src={'/expand-icon.svg'}
              height={24}
              width={24}
              alt="Expand"
            />
          </div>
          {field?.open ? (
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
              <button
                type="button"
                onClick={() => onQuery(index)}
                className="primary-gradient text-[12px] font-medium py-[6px] px-6 leading-[20px] rounded-lg h-10 w-20 flex-center-center"
              >
                {queryLoading === TxStatus.PENDING ? (
                  <CircularProgress size={18} sx={{ color: 'white' }} />
                ) : (
                  'Query'
                )}
              </button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default MessageInputFields;
