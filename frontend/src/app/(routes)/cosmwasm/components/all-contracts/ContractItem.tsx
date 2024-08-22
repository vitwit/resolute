import CommonCopy from '@/components/CommonCopy';
import Link from 'next/link';
import React from 'react';

const ContractItem = ({ contract }: { contract: string }) => {
  return (
    <tr>
      <td>
        <CommonCopy
          message={contract}
          style="w-fit text-white"
          plainIcon={true}
        />
      </td>
      <td>
        <Link href={`?contract=${contract}`}>
          <button className="select-btn primary-gradient">
            Select Contract
          </button>
        </Link>
      </td>
    </tr>
  );
};

export default ContractItem;
