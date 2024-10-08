import SectionHeader from '@/components/common/SectionHeader';
import React from 'react';

const MultisigAccountsLoading = () => {
  return (
    <div>
      <SectionHeader
        title={'Multisig Accounts'}
        description="All multisig accounts you are part of"
      />
      <div className="grid grid-cols-3 gap-10 px-6 py-0 mt-10">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="w-[338px] h-[143px] animate-pulse bg-[#252525] rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
};

export default MultisigAccountsLoading;
