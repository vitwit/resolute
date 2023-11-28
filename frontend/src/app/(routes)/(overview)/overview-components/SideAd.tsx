import Image from 'next/image';
import React, { useState } from 'react';

const SideAd = () => {
  const [adOpen, setAdOpen] = useState<boolean>(true);

  return adOpen ? (
    <div className="my-10 flex cursor-pointer text-white">
      <Image
        src="https://dummyimage.com/326X216/000/fff&text=Overview+Ad2"
        width={326}
        height={216}
        alt="Ad"
      />
      <Image
        onClick={() => setAdOpen(false)}
        className="absolute"
        src="/close.svg"
        width={30}
        height={30}
        alt="Ad"
      />
    </div>
  ) : (
    <div className="my-10"></div>
  );
};
export default SideAd;
