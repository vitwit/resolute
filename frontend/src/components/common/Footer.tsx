import React from 'react';
import Image from 'next/image';
import { RESOLUTE_LOGO } from '@/constants/image-names';

const Footer = () => {
  return (
    <div className="footer-bg mt-8">
      <div className="flex justify-between w-full">
        <div>
          <Image
            src={RESOLUTE_LOGO}
            width={180}
            height={55}
            alt="resolute-logo"
          />
        </div>
        <div className="flex gap-4 justify-end">
          <a
            href="https://t.me/+3bXmS6GE4HRjYmU1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/telegram-icon.png"
              width={24}
              height={24}
              alt="telegram-logo"
              // className="w-6 h-6"
            />
          </a>
          <a
            href="https://github.com/vitwit/resolute"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/github-logo.png"
              width={24}
              height={24}
              alt="github-logo"
              // className="w-6 h-6"
            />
          </a>
          <a
            href="https://twitter.com/vitwit_"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/twitter-icon.png"
              width={24}
              height={24}
              alt="twitter-logo"
              // className="w-6 h-6"
            />
          </a>
          <a
            href="https://www.youtube.com/@vitwit8623"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/youtube-logo.png"
              width={24}
              height={24}
              alt="youtube-logo"
              className="w-7 h-7"
            />
          </a>
          <a
            href="https://discord.com/invite/3DFmK7dG"
            target="_blank"
            rel="noopener noreferrer"
          >
             <Image
              src="/discord-logo.png"
              width={24}
              height={24}
              alt="discord-logo"
              className="w-8 h-8"
            />
          </a>
        </div>
      </div>
      <div className="text-[12px] font-extralight">
        Vitwit, founded in 2015 in Hyderabad, India, specializes in AI,
        blockchain, and cloud solutions, with a focus on <br /> the Cosmos
        ecosystem and validator operations​ (Vitwit)​.
      </div>
      <div className='divider-line'></div>
      <div className="text-[12px] font-extralight text-center w-full">
        All rights reserved at @ Vitwit 2024
      </div>
    </div>
  );
};

export default Footer;
