import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import SectionHeader from '@/components/common/SectionHeader';
import { MULTISIG_DESCRIPTION } from '@/utils/constants';

const MultisigLoading = () => {
  return (
    <div className="py-20 px-10 h-full flex flex-col">
      <div className="flex items-center gap-10 w-full">
        <div className="flex-1">
          <PageHeader title="MultiSig" description={MULTISIG_DESCRIPTION} />
        </div>

        <div className="w-[145px] h-[40px] animate-pulse bg-[#252525] rounded-full"></div>
      </div>
      <div className="grid grid-cols-3 gap-10 px-6 py-0 mt-10">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="w-[338px] h-[143px] animate-pulse bg-[#252525] rounded"
          />
        ))}
      </div>
      <div className="pt-20">
        <SectionHeader
          title={'Recent Transactions'}
          description="Recent transactions from all multisig accounts"
        />
        <div className="mt-10 px-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <p className="w-10 h-10 animate-pulse bg-[#252525] rounded-full"></p>
                <p className="w-[130px] h-[21px] animate-pulse bg-[#252525] rounded"></p>
              </div>
              <p className="w-[113px] h-[24px] animate-pulse bg-[#252525] rounded-full"></p>
            </div>
            <div className="w-[1064px] h-[95px] animate-pulse bg-[#252525] rounded"></div>
            <div className="w-[1064px] h-[95px] animate-pulse bg-[#252525] rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultisigLoading;
