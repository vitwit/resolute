import React from 'react';
import Image from 'next/image';
import './style.css';

const NoProposals = () => {
  return (
    <div className="flex flex-col justify-center  gap-10 flex-[1_0_0] self-stretch px-10 py-20">
      <div className="flex flex-col items-start">
        <div className="text-white text-[28px] not-italic font-bold leading-[normal] text-start">
          Governance
        </div>
        <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
          Connect your wallet now to access all the modules on resolute{' '}
        </div>
        <div className="divider-line"></div>
      </div>
      <div className="flex flex-col justify-center items-center gap-10">
        <div>
          <Image
            src="/dashboard.png"
            width={914}
            height={480}
            alt="Dashboard-Image"
          />
          <div className="flex flex-col justify-center items-center gap-6 self-stretch">
            <p className="text-[32px] not-italic font-bold leading-10 text-bg">
              No Proposals
            </p>
            <p className="text-bg text-base not-italic font-extralight leading-[21px] tracking-[1.6px]">
              Connect your wallet to access your account on Resolute
            </p>
          </div>
        </div>
        <div className="primary-btn text-white text-base not-italic font-normal leading-[normal] cursor-pointer">
          Select Network
        </div>
      </div>
    </div>
  );
};
export default NoProposals;
