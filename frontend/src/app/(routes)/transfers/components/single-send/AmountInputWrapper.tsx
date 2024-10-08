import React from 'react';
import AmountInputField from './AmountInputField';

type QuickSelectAmountFunc = (value: string) => void;

const AmountInputWrapper = ({
  control,
  quickSelectAmount,
  selectedAsset,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  control: any;
  quickSelectAmount: QuickSelectAmountFunc;
  selectedAsset: ParsedAsset | null;
}) => {
  return (
    <div className="border-[0.25px] border-[#ffffff10] rounded-3xl py-6 px-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <AmountInputField control={control} />
          </div>
          <div className="flex items-center gap-6">
            <QuickSetAmountButton
              value="half"
              quickSelectAmount={quickSelectAmount}
            />
            <QuickSetAmountButton
              value="max"
              quickSelectAmount={quickSelectAmount}
            />
          </div>
        </div>
        <div className="secondary-text font-light !text-[12px] gap-1 hidden max:flex">
          <div>Balance</div>
          {selectedAsset ? (
            <div>
              {String(selectedAsset.balance).split('.')[0]}
              {selectedAsset.balance > 0 ? (
                <span className="text-[10px]">
                  .{String(selectedAsset.balance).split('.')[1]}
                </span>
              ) : null}{' '}
              {selectedAsset.displayDenom}
            </div>
          ) : (
            '-'
          )}
        </div>
      </div>
    </div>
  );
};
export default AmountInputWrapper;

const QuickSetAmountButton = ({
  value,
  quickSelectAmount,
}: {
  value: string;
  quickSelectAmount: QuickSelectAmountFunc;
}) => {
  return (
    <button
      onClick={() => quickSelectAmount(value)}
      type="button"
      className="primary-btn w-20 capitalize !h-[25px]"
    >
      {value}
    </button>
  );
};
