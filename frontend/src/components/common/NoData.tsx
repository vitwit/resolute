import { NO_DATA_ILLUSTRATION } from '@/constants/image-names';
import Image from 'next/image';
import React from 'react';

const NoData = ({
  height,
  width,
  message,
}: {
  width: number;
  height: number;
  message: string;
}) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <Image
        src={NO_DATA_ILLUSTRATION}
        height={height}
        width={width}
        alt="No Data"
      />
      <div className="empty-screen-description">{message}</div>
    </div>
  );
};

export default NoData;
