'use client';
import Image from 'next/image';
import React, { useState } from 'react';

const StakingSideBarAds = () => {
  const [ad1Open, setAd1Open] = useState<boolean>(true);
  const [ad2Open, setAd2Open] = useState<boolean>(true);

  return (
    <div className="mt-10 space-y-10">
      {ad1Open ? (
        <div className="relative">
          <div className="ad-close">
            <Image
              onClick={() => setAd1Open(false)}
              src="/close.svg"
              width={30}
              height={30}
              alt="Ad"
            />
          </div>
          <Image
            className="cursor-pointer"
            src="/staking-ad-1.png"
            width={445}
            height={166}
            alt="Ad"
          />
        </div>
      ) : null}
      {ad2Open ? (
        <div className="relative">
          <div className="ad-close">
            <Image
              onClick={() => setAd2Open(false)}
              src="/close.svg"
              width={30}
              height={30}
              alt="Ad"
            />
          </div>
          <Image
            className="cursor-pointer"
            src="/staking-ad-2.png"
            width={445}
            height={312}
            alt="Ad"
          />
        </div>
      ) : null}
    </div>
  );
};

export default StakingSideBarAds;
