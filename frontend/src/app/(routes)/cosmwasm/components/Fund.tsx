import React from 'react';
import TokensList from './TokensList';
import AmountInputField from './AmountInputField';

const Fund = ({
  assetsList,
  fund,
  onDelete,
  index,
  funds,
  setFunds,
}: {
  assetsList: AssetInfo[];
  fund: FundInfo;
  onDelete: () => void;
  index: number;
  funds: FundInfo[];
  setFunds: (value: React.SetStateAction<FundInfo[]>) => void;
}) => {
  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const input = e.target.value;
    const newFunds = funds.map((value, key) => {
      if (index === key) {
        if (/^-?\d*\.?\d*$/.test(input)) {
          if ((input.match(/\./g) || []).length <= 1) {
            value.amount = input;
          }
        }
      }
      return value;
    });
    setFunds(newFunds);
  };

  return (
    <div className="flex gap-6">
      <TokensList
        assetsList={assetsList}
        denom={fund.denom}
        index={index}
        funds={funds}
        setFunds={setFunds}
      />
      <AmountInputField
        amount={fund.amount}
        handleChange={handleAmountChange}
        onDelete={onDelete}
        index={index}
      />
    </div>
  );
};

export default Fund;
