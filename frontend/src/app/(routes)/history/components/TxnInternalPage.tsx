'use client';
import Image from 'next/image';
import { useState } from 'react';
import Messages from './Messages';
import Rightbar from './Rightbar';

const TxnInternalPage = () => {
  const [transactionStatus, setTransactionStatus] = useState('success');

  return (
    <div className="flex pt-20 pb-10 px-10 w-full h-[calc(100vh_-_64px)]">
      <div className="flex gap-20 w-full">
        <div className="flex flex-1 w-full ">
          <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-col gap-6">
              <p className="secondary-btn">Go back</p>
              <div className="flex flex-col gap-2">
                {transactionStatus === 'success' ? (
                  <div className="flex items-center">
                    <Image
                      src="/tick.png"
                      width={32}
                      height={32}
                      alt="Tick-icon"
                    />
                    <p className="text-h1 text-[#32EE32]">
                      Transaction Success
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Image
                      src="/cross.png"
                      width={32}
                      height={32}
                      alt="Cross-icon"
                    />
                    <p className="text-h1 text-[#F15757]">Transaction Failed</p>
                  </div>
                )}

                <div className="flex gap-2 ml-8">
                  <p className="text-b1">98D7W5D4A6AH9 </p>
                  <Image
                    src="/copy.svg"
                    width={24}
                    height={24}
                    alt="copy-icon"
                  />
                </div>

                <div className="divider-line"></div>
              </div>
            </div>
            <Messages />
          </div>
        </div>

        {/* RightView */}
        <Rightbar />
      </div>
    </div>
  );
};

export default TxnInternalPage;
