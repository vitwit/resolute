import React from 'react';
import MultiSend from './MultiSend';

const MultiSendPage = ({ chainID }: { chainID: string }) => {
  return (
    <div className="px-10 flex flex-col md:flex-row gap-6 justify-between items-center h-full">
      <div className="space-y-4 w-[600px] md:w-[400px]">
        <div className="text-[20px] font-bold">Multi Transfer</div>
        <div className="divider-line"></div>
        <div className="secondary-text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et obcaecati
          dicta cumque ex pariatur nulla ipsa rem qui sunt aspernatur
        </div>
      </div>
      <div className=" max-w-[600px]">
        <MultiSend chainID={chainID} />
      </div>
    </div>
  );
};

export default MultiSendPage;
