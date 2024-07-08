import React from 'react';
import Image from 'next/image';
import messages from '@/utils/messages.json';

const NoAssets = () => {
  return (
    <div className="flex flex-col flex-1 gap-6 items-center justify-center">
      <Image
        className="disable-draggable"
        src="/illustrate.png"
        width={232}
        height={200}
        alt="no assets"
      />
      <div className="text-center text-base italic font-extralight leading-[normal] flex justify-center opacity-50 disable-draggable">
        {messages.noAssets}
      </div>
    </div>
  );
};

export default NoAssets;
