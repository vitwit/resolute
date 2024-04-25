import CommonCopy from '@/components/CommonCopy';
import { shortenName } from '@/utils/util';
import React from 'react';

const ContractItem = ({
  name,
  address,
  onSelectContract,
}: {
  name: string;
  address: string;
  onSelectContract: () => void;
}) => {
  return (
    <div
      onClick={() => onSelectContract()}
      className="contract-item"
    >
      <div className="w-[20%] truncate font-semibold">{shortenName(name, 20)}</div>
      <CommonCopy message={address} style="!bg-transparent" plainIcon={true} />
    </div>
  );
};
export default ContractItem;
