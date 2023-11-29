import React from 'react';
import Summary from './Summary';
import SendPage from '../SendPage';

const SingleTransfer = ({ chainID }: { chainID: string }) => {
  return (
    <div className="w-full h-full space-y-6">
      <Summary chainID={chainID} />
      <SendPage chainID={chainID} />
    </div>
  );
};

export default SingleTransfer;
