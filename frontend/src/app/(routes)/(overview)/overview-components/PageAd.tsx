import Image from 'next/image';
import React, { useState } from 'react';

const PageAd = () => {
  const [adOpen, setAdOpen] = useState<boolean>(true);

  return adOpen ? (
    <div className="my-10 flex cursor-pointer text-white relative">
      <div className="ad-close">
        <Image
          onClick={() => setAdOpen(false)}
          src="/close.svg"
          width={24}
          height={24}
          alt="Close ad"
        />
      </div>
      <Image
        src="https://dummyimage.com/1000X80/000/fff&text=Overview+Ad1"
        width={1000}
        height={80}
        alt="Ad"
      />
    </div>
  ) : (
    <div className="my-10"></div>
  );
};

export default PageAd;
