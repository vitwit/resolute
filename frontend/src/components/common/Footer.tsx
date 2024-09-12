import React from 'react';
import Image from 'next/image';
import { RESOLUTE_LOGO } from '@/constants/image-names';

const Footer = () => {
  return (
    <div className="footer-bg mt-8">
      <div>
        {/* <Image
            src="resolute-logo-vitwit.svg"
            width={100}
            height={20}
            alt="resolute-logo"
          /> */}
        <p className="text-h1">RESOLUTE</p>
        <p className="text-b1 opacity-50">Powered by vitwit</p>
      </div>

      <div className="text-b1">
        Vitwit is a leading Cosmos dev agency and validator company. Proudly
        serving as one of the core contributors to the Cosmos SDK.
      </div>
      <div className="flex gap-10 justify-between">
        <a
          className="flex gap-2 items-center"
          href="https://t.me/+3bXmS6GE4HRjYmU1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/telegram-icon.png"
            width={20}
            height={20}
            alt="telegram-logo"
            // className="w-5 h-5"
          />
          <p className="">telegram</p>
        </a>
        <div className='v-line !h-10'></div>
        <a
          className="flex gap-2 items-center"
          href="https://github.com/vitwit/resolute"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/github-logo.png"
            width={20}
            height={20}
            alt="github-logo"
            // className="w-6 h-6"
          />
          <p> github</p>
        </a>
        <div className='v-line !h-10'></div>
        <a
          className="flex gap-2 items-center"
          href="https://twitter.com/vitwit_"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/twitter-icon.png"
            width={20}
            height={20}
            alt="twitter-logo"
            // className="w-6 h-6"
          />
          <p>twitter</p>
        </a>
        <div className='v-line !h-10'></div>
        <a
          className="flex gap-2 items-center"
          href="https://www.youtube.com/@vitwit8623"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/youtube-logo.png"
            width={20}
            height={24}
            alt="youtube-logo"
            className="w-6 h-6"
          />
          <p>youtube</p>
        </a>
      </div>
    </div>
  );
};

export default Footer;
