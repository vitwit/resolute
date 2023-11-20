import Image from 'next/image';
import React from 'react';

const SideAd = () => {
  return (
    <div className="my-10 cursor-pointer text-white">
      <Image
        src="https://dummyimage.com/326X216/000/fff&text=Overview+Ad2"
        width={326}
        height={216}
        alt="Ad"
      />
    </div>
  );
};

export default SideAd;
