import Image from 'next/image';
import React from 'react';

const PageAd = () => {
  return (
    <div className="my-10 cursor-pointer brightness-50">
      <Image
        src="https://dummyimage.com/1000X80/000/fff&text=Overview+Ad1"
        width={1000}
        height={80}
        alt="Ad"
      />
    </div>
  );
};

export default PageAd;
