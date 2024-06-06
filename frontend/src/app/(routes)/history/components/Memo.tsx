import React from 'react';
import Image from 'next/image';

const memo = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor iLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor `;
const Memo = () => {
  return (
    <div className="right-view-grid">
      <div className="flex space-x-2">
        <Image src="/memo.svg" width={24} height={24} alt="Memo-Icon" />
        <p className="text-b1 items-center flex">Memo</p>
      </div>
      <div className="divider-line"></div>
      <div className="text-b1">{memo}</div>
    </div>
  );
};

export default Memo;
