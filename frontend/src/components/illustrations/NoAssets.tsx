import React from 'react';
import Image from 'next/image';
import messages from '@/utils/messages.json';

const NoAssets = () => {
  return (
    <div className="flex flex-col flex-1 gap-6 items-center justify-center disable-draggable">
      <Image
        src="/no-assets-illustration.png"
        width={400}
        height={236}
        alt="no assets"
      />
      <div className="text-white text-center text-base italic font-extralight leading-[normal] flex justify-center opacity-50">
        {messages.noAssets}
      </div>
    </div>
  );
};

export default NoAssets;
