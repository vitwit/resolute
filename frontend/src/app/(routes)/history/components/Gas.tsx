import React from 'react';
import Image from 'next/image';

const gasUsed = '123,298,987';
const gasWanted = '123,298,987';
const Gas = () => {
  return (
    <div className="right-view-grid">
      <div className="flex space-x-2">
        <Image src="/gas.svg" width={24} height={24} alt="Gas-Icon" />
        <p className="text-b1 items-center flex">Gas used / wanted</p>
      </div>
      <div className="divider-line"></div>
      <div className="text-b1">
        {gasUsed}/ {gasWanted}
      </div>
    </div>
  );
};

export default Gas;
