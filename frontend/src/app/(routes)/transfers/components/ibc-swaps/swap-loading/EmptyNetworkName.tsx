import React from 'react';

const EmptyNetworkName = ({ isSource }: { isSource: boolean }) => {
  return (
    <div className="bg-[#FFFFFF14] w-[120px] rounded-full py-2 px-4 text-[#FFFFFF33] text-center capitalize">
      {isSource ? 'Source' : 'Destination'}
    </div>
  );
};

export default EmptyNetworkName;
