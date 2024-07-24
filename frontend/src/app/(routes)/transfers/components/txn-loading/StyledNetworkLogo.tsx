import Image from 'next/image';
import React, { useId } from 'react';

const StyledNetworkLogo = ({
  color,
  logo,
}: {
  color: string;
  logo: string;
}) => {
  const id = useId();

  return (
    <div className="relative h-40 w-40 md:h-32 md:w-32 max:h-40 max:w-40">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 160 160"
        fill="none"
        className="w-full h-full"
      >
        <g filter={`url(#filter-${id})`}>
          <circle cx="80" cy="80" r="68" fill={`url(#gradient-${id})`} />
          <circle
            cx="80"
            cy="80"
            r="66"
            stroke={`url(#gradient-${id})`}
            strokeWidth="4"
          />
        </g>
        <circle cx="80" cy="80" r="62.5" fill="#09090A" />
        <defs>
          <filter
            id={`filter-${id}`}
            x="0"
            y="0"
            width="160"
            height="160"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="6.5"
              result="effect1_foregroundBlur_2679_9292"
            />
          </filter>
          <linearGradient
            id={`gradient-${id}`}
            x1="80"
            y1="14"
            x2="80"
            y2="146"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-[33%] md:inset-[28%] max:inset-[33%] w-[56px] h-[56px]">
        <Image
          className="w-[56px] h-[56px]"
          src={logo}
          layout="fill"
          objectFit="contain"
          alt=""
        />
      </div>
    </div>
  );
};

export default StyledNetworkLogo;
