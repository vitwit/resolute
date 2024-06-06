import React from 'react';

type QuickSelectAmountFunc = (value: string) => void;

const AmountInputWrapper = ({
  quickSelectAmount,
  balance,
  displayDenom,
  depositAmount,
  handleInputChange,
}: {
  quickSelectAmount: QuickSelectAmountFunc;
  balance: number;
  displayDenom: string;
  depositAmount: string;
  handleInputChange: HandleChangeEvent;
}) => {
  return (
    <div className="border-[0.25px] border-[#ffffff10] rounded-3xl py-4 px-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              value={depositAmount}
              onChange={handleInputChange}
              className="amount-input-field"
              placeholder="0"
              required
            />
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
        <div className="secondary-text font-light !text-[12px] flex gap-1">
          <div>Available Balance</div>
          {balance ? (
            <div>
              {balance} {displayDenom}
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
      className="primary-btn w-20 capitalize"
    >
      {value}
    </button>
  );
};
