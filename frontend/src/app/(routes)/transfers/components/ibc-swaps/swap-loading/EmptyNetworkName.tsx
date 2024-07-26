import React from 'react';

const EmptyNetworkName = ({ isSource }: { isSource: boolean }) => {
  return (
    <div className="bg-[#FFFFFF14] w-[120px] rounded-full flex items-center justify-center text-[#FFFFFF33] text-center capitalize h-8 text-[14px]">
      {isSource ? 'Source' : 'Destination'}
    </div>
  );
};

export default EmptyNetworkName;
