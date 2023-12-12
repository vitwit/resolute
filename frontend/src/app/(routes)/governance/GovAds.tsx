import React, { useState } from 'react';
import Image from 'next/image';

const GovAds = () => {
  const [adOpen, setAdOpen] = useState<boolean>(true);

  return (
    <div>
      {adOpen ? (
        <div className="relative">
          <div className="ad-close">
            <Image
              onClick={() => setAdOpen(false)}
              src="/close.svg"
              width={30}
              height={30}
              alt="Close ad"
            />
          </div>

          <Image
            src="/ad.png"
            height={80}
            width={1800}
            alt="Advertisement-Image"
          />
        </div>
      ) : null}
    </div>
  );
};

export default GovAds;
