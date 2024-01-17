import React from 'react';
import Image from 'next/image';

const NotSupported = ({ feature }: { feature: string }) => {
  return (
    <div className="flex flex-col flex-1 gap-6 items-center justify-center">
      <Image
        className="disable-draggable"
        src="/no-assets-illustration.png"
        width={400}
        height={236}
        alt="no assets"
      />
      <div className="text-white text-center text-base italic font-extralight leading-[normal] flex justify-center opacity-50 disable-draggable">
        {feature} is not supported in authz mode yet
      </div>
    </div>
  );
};

export default NotSupported;
