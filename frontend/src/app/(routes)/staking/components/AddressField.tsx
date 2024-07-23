import React from 'react';
import InputField from './InputField';

const AddressField = ({
  quickSelectAmount,
  availableAmount,
  denom,
  onChange,
  value,
  balanceTypeText,
}: {
  quickSelectAmount: (value: number) => void;
  availableAmount?: number;
  denom?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: number;
  balanceTypeText: string;
}) => {
  return (
    <div className="border-[0.25px] border-[#ffffff10] rounded-3xl py-6 px-6 w-full hover:border-[#ffffff30]">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="text-[14px] font-light leading-[24px]">{denom}</div>
          <div className="flex-1">
            <InputField value={value} onChange={onChange} />
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => quickSelectAmount(0.5)}
              type="button"
              className="primary-btn w-20 capitalize"
            >
              {'Half'}
            </button>
            <button
              onClick={() => quickSelectAmount(1)}
              type="button"
              className="primary-btn w-20 capitalize"
            >
              {'Max'}
            </button>
          </div>
        </div>
        <div className="secondary-text font-light">
          {balanceTypeText} Balance {availableAmount?.toFixed(6)} {denom}
        </div>
      </div>
    </div>
  );
};
export default AddressField;
