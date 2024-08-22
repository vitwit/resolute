import React from 'react';
import Fund from './Fund';

interface SelectFundsI {
  onAddFund: (fund: FundInfo) => void;
  funds: FundInfo[];
  assetsList: AssetInfo[];
  onDelete: (index: number) => void;
  setFunds: (value: React.SetStateAction<FundInfo[]>) => void;
}

const SelectFunds = (props: SelectFundsI) => {
  const { onAddFund, funds, assetsList, onDelete, setFunds } = props;
  const handleAddFund = () => {
    onAddFund({
      amount: '',
      denom: '',
      decimals: 1,
    });
  };
  return (
    <div>
      {assetsList?.length ? (
        <div className="space-y-6">
          {funds.map((fund, index) => (
            <Fund
              key={index}
              assetsList={assetsList}
              fund={fund}
              onDelete={() => onDelete(index)}
              index={index}
              funds={funds}
              setFunds={setFunds}
            />
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              className="primary-gradient add-funds-btn"
              onClick={handleAddFund}
            >
              Add More
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center pt-6">
          - Assets not found, Please select:{' '}
          <span className="font-medium bg-[#ffffff0d] p-1 rounded-lg">
            Provide Assets List
          </span>{' '}
          option to enter manually -
        </div>
      )}
    </div>
  );
};

export default SelectFunds;
