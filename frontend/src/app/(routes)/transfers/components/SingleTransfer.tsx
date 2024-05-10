import React from 'react';
import Summary from './Summary';
import SendPage from '../SendPage';

const SingleTransfer = ({
  sortedAssets,
  chainIDs,
}: {
  sortedAssets: ParsedAsset[];
  chainIDs: string[];
}) => {
  return (
    <div className="w-full h-full space-y-6 flex flex-col flex-1">
      <Summary chainIDs={chainIDs} borderStyle="rounded-[16px_16px_0px_0px]" />
      <div className="px-6 pb-6 flex flex-col flex-1">
        <SendPage sortedAssets={sortedAssets} />
      </div>
    </div>
  );
};

export default SingleTransfer;
