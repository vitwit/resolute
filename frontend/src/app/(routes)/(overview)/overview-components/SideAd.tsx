import Image from 'next/image';
import React, { useState } from 'react';

const SideAd = () => {
  const [adOpen, setAdOpen] = useState<boolean>(true);

  return adOpen ? (
    <div className="my-10 flex cursor-pointer text-white">
      <div className="relative">
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
          src="https://dummyimage.com/326X216/000/fff&text=Overview+Ad2"
          width={316}
          height={216}
          alt="Ad"
        />
      </div>
    </div>
  ) : (
    <div className="my-10"></div>
  );
};
export default SideAd;
