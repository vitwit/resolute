import Image from 'next/image';
import React from 'react';

const TxnTimeStamp = ({
  success,
  timeStamp,
}: {
  success: boolean;
  timeStamp: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[120px]">
      <p className="text-small">{timeStamp}</p>
      <p className="v-line"></p>
      <Image
        src={success ? '/success-icon.svg' : '/failed-icon.svg'}
        width={24}
        height={24}
        alt="status-icon"
      />
      <p className="v-line"></p>
    </div>
  );
};

export default TxnTimeStamp;
