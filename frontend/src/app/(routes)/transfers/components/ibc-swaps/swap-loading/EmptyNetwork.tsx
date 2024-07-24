import { GLOBE_ICON } from '@/constants/image-names';
import Image from 'next/image';
import React from 'react';

const EmptyNetwork = () => {
  return (
    <div className="network-image-container px-[10px]">
      <div
        className="blur-background"
        style={{
          backgroundColor: '#7F5CED',
        }}
      ></div>
      <div className="circle-background">
        <Image src={GLOBE_ICON} width={32} height={32} alt="" />
      </div>
    </div>
  );
};

export default EmptyNetwork;
