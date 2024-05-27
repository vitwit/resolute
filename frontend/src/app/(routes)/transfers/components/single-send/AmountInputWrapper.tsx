import React from 'react';
import AmountInputField from './AmountInputField';

type QuickSelectAmountFunc = (value: string) => void;

const AmountInputWrapper = ({
  control,
  quickSelectAmount,
}: {
  control: any;
  quickSelectAmount: QuickSelectAmountFunc;
}) => {
  return (
    <div className="border-[0.25px] border-[#ffffff30] rounded-3xl py-10 px-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="text-[14px] font-light leading-[24px]">{'AKT'}</div>
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
        <div className="secondary-text font-light">
          Available Balance {'25.453'} {'AKT'}
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
      className="primary-btn w-20 capitalize"
    >
      {value}
    </button>
  );
};
