import React from 'react';
import SearchContracts from './SearchContracts';

const Contracts = () => {
  return (
    <div className="space-y-10">
      <div className="border-b-[1px] border-[#ffffff1e] pb-4 space-y-2">
        <div className="text-[18px] font-bold">Smart Contracts</div>
        {/* TODO: Update the dummy description */}
        <div className="leading-[18px] text-[12px] font-extralight">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Necessitatibus fuga consectetur reiciendis fugit suscipit ab.
        </div>
      </div>
      <div className="space-y-6">
        <SearchContracts />
        <div className="text-[18px]">
          Don&apos;t have a contract? then deploy it{' '}
          <span className="font-bold underline underline-offset-[3px] cursor-pointer">
            here
          </span>{' '}
        </div>
      </div>
    </div>
  );
};

export default Contracts;
