import React from 'react';
import Fund from './Fund';
import { ADD_ICON_ROUNDED } from '@/constants/image-names';
import Image from 'next/image';

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
          <div className="flex justify-center">
            <button
              type="button"
              className="flex items-center gap-2"
              onClick={handleAddFund}
            >
              <Image src={ADD_ICON_ROUNDED} width={18} height={18} alt="" />
              <div className="text-[12px]">Add More</div>
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
