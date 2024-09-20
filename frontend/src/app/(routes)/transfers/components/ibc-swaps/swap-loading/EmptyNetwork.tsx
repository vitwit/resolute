import { GLOBE_ICON } from '@/constants/image-names';
import Image from 'next/image';
import React from 'react';

const EmptyNetwork = () => {
  return (
    <div className="network-image-container px-[10px]">
      <div
        className="blur-background"
        style={{
          backgroundColor: '#7F5CED20',
        }}
      ></div>
      <div className="circle-background opacity-50 globe-container">
        <Image
          className="animate-rotate-x"
          src={GLOBE_ICON}
          width={32}
          height={32}
          alt=""
        />
      </div>
    </div>
  );
};

export default EmptyNetwork;
