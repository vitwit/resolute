import React from 'react';
import SendPage from '../SendPage';

const SingleTransfer = ({ chainIDs }: { chainIDs: string[] }) => {
  return (
    <div className="w-full h-full space-y-6">
      {/* <Summary chainIDs={chainIDs} /> */}
      <SendPage chainIDs={chainIDs} />
    </div>
  );
};

export default SingleTransfer;
