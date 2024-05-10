import Image from 'next/image';
import React from 'react';

const ContractNotSelected = () => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/file-upload-icon.svg"
        width={32}
        height={32}
        alt="Search Contract"
      />
      <div>Select or search contract</div>
    </div>
  );
};

export default ContractNotSelected;
