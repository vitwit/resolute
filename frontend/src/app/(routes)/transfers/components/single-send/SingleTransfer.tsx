import React from 'react';
import SingleSend from './SingleSend';
import PageHeader from '@/components/common/PageHeader';

const SingleTransfer = ({ sortedAssets }: { sortedAssets: ParsedAsset[] }) => {
  return (
    <div className="space-y-6 h-full flex flex-col py-10">
      <PageHeader title="Single Transfer" description="Single Transfer" />
      <SingleSend sortedAssets={sortedAssets} />
    </div>
  );
};

export default SingleTransfer;
