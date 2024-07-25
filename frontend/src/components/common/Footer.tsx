import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <div className="footer-bg mt-8">
      <div className="flex justify-between w-full">
        <div>
          <Image
            src="/resolute-logo.png"
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
              className="w-6 h-6"
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
              className="w-6 h-6"
            />
          </a>
          <a
            href="https://discord.com/invite/3DFmK7dG"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-b1">Join our community</p>
          </a>
        </div>
      </div>
      <div className="secondary-text">
        Vitwit, founded in 2015 in Hyderabad, India, specializes in AI,
        blockchain, and cloud solutions, with a focus on <br /> the Cosmos
        ecosystem and validator operations​ (Vitwit)​.
      </div>
      <div className="secondary-text text-center w-full">
        All right reserved at @ Vitwit 2024
      </div>
    </div>
  );
};

export default Footer;
