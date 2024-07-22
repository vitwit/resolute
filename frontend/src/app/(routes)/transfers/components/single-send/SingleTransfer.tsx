import React from 'react';
import SingleSend from './SingleSend';
import PageHeader from '@/components/common/PageHeader';

const SingleTransfer = ({ sortedAssets }: { sortedAssets: ParsedAsset[] }) => {
  return (
    <div className="space-y-6 h-full flex flex-col py-10">
      <PageHeader title="Single Transfer" description="Single Transfer" />
      <div className="flex-1 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="max-w-[550px]">
          <SingleSend sortedAssets={sortedAssets} />
        </div>
        <div className="space-y-2 w-[600px] md:w-[400px]"></div>
      </div>
    </div>
  );
};

export default SingleTransfer;
