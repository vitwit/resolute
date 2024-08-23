import React, { useState } from 'react';
import TransactionHeader from './TransactionHeader';
import Image from 'next/image';

const RepeatTransaction = () => {
  const countTypeCards = [
    {
      title: 'Delegates',
      validatorLogo: '/akash1.png',
      validatorName: 'Stakefish',
      amount: '120 AKT',
      autoClaimRewards: '120 AKT',
    },
    {
      title: 'Delegates',
      validatorLogo: '/akash2.png',
      validatorName: 'Everstake',
      amount: '150 AKT',
      autoClaimRewards: '150 AKT',
    },
    {
      title: 'Delegates',
      validatorLogo: '/akash3.png',
      validatorName: 'Cosmos',
      amount: '200 AKT',
      autoClaimRewards: '200 AKT',
    },
    {
      title: 'Delegates',
      validatorLogo: '/akash1.png',
      validatorName: 'Stakefish',
      amount: '120 AKT',
      autoClaimRewards: '120 AKT',
    },
    {
      title: 'Delegates',
      validatorLogo: '/akash2.png',
      validatorName: 'Everstake',
      amount: '150 AKT',
      autoClaimRewards: '150 AKT',
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div>
      <TransactionHeader status="success" />
      <div className="flex gap-10 w-full">
        <div className="flex-1 flex w-full">
          <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-2 gap-6">
              <div className="txn-history-card">
                <p className="text-b1-light">Network</p>
                <div className="flex gap-2 items-center">
                  <Image
                    src="/akash1.png"
                    width={24}
                    height={24}
                    alt="network-logo"
                    className="w-6 h-6"
                  />
                  <p className="text-h2 font-bold">Akash</p>
                </div>
              </div>
              <div className="txn-history-card">
                <p className="text-b1-light">Fees</p>
                <div className="text-h2 font-bold">120 AKT</div>
              </div>
            </div>

            
            {countTypeCards.map((card, index) => (
              <div key={index} className="count-type-card-extend w-full">
                <div className="count-type-card">
                  <div
                    className="flex justify-between w-full"
                    onClick={() => toggleExpand(index)}
                  >
                    <p className="text-b1">{card.title}</p>
                    <Image
                      src="/down-arrow.svg"
                      width={24}
                      height={24}
                      alt="drop-icon"
                      className={`transition-transform duration-500 ease-in-out ${
                        expandedIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
                {expandedIndex === index && (
                  <div className="flex justify-between px-6 w-full pb-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-b1-light">Validator</p>
                      <div className="flex gap-2 items-center">
                        <Image
                          src={card.validatorLogo}
                          width={24}
                          height={24}
                          alt="validator-logo"
                        />
                        <span className="text-b1">{card.validatorName}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-b1-light">Amount</div>
                      <div className="text-b1">{card.amount}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-b1-light">Auto Claim Rewards</div>
                      <div className="text-b1">{card.autoClaimRewards}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar content */}
        <div className="flex flex-col gap-10">
          <div className="txn-history-card w-[352px]">
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-b1-light">Gas Used / Wanted</p>
              <div className="text-b1 font-bold">
                <span>123,478,987</span>
                <span>/</span>
                <span>123,478,987</span>
              </div>
            </div>
          </div>

          <div className="txn-history-card w-[352px]">
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-b1-light">TimeStamp</p>
              <div className="text-b1 font-bold">24th March 2023, 11:34 pm</div>
            </div>
          </div>

          <div className="txn-history-card w-[352px]">
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-b1-light">Height</p>
              <div className="text-b1 font-bold">2123,478,987</div>
            </div>
          </div>

          <div className="txn-history-card w-[352px]">
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-b1-light">Memo</p>
              <div className="text-b1 font-bold">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepeatTransaction;
