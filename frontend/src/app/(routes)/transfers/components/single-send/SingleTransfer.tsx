import React from 'react';
import SingleSend from './SingleSend';
import IBCSendAlert from './IBCSendAlert';

const SingleTransfer = ({ sortedAssets }: { sortedAssets: ParsedAsset[] }) => {
  return (
    <>
      <IBCSendAlert />
      <div className="px-10 flex flex-col md:flex-row gap-6 justify-between items-center h-full">
        <div className="space-y-2 w-[600px] md:w-[400px]">
          <div className="text-[20px] font-bold">Single Transfer</div>
          <div className="divider-line"></div>
          <div className="secondary-text">Single Transfer</div>
        </div>
        <div className="max-w-[600px]">
          <SingleSend sortedAssets={sortedAssets} />
        </div>
      </div>
    </>
  );
};

export default SingleTransfer;
