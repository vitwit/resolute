'use client';
import Image from 'next/image';
import '../multisig.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const txnsTypes = [
  'Txn to be signed',
  'Txn to be completed',
  'Completed Txns',
  'Failed Txns',
];
const Transactions = [
  {
    Txnname: 'Sent 100 AKT to pasg1h329kntmw805f3mqgv40xy8vrmr8prut0v5dv7',
    Status: 'pending',
    Signed: ['sign1', 'sign2'],
    Action: 'Broadcast',
    Threshold: 2,
  },
  {
    Txnname: 'Sent 100 AKT to pasg1h329kntmw805f3mqgv40xy8vrmr8prut0v5dv7',
    Status: 'pending',
    Signed: ['sign1'],
    Action: 'Broadcast',
    Threshold: 2,
  },
  {
    Txnname: 'Sent 100 AKT to pasg1h329kntmw805f3mqgv40xy8vrmr8prut0v5dv7',
    Status: 'Success',
    Signed: [],
    Action: 'Broadcast',
    Threshold: 2,
  },
  {
    Txnname: 'Sent 100 AKT to pasg1h329kntmw805f3mqgv40xy8vrmr8prut0v5dv7',
    Status: 'Failed',
    Signed: [],
    Action: 'Broadcast',
    Threshold: 2,
  },
];
const SingleMultisig = () => {
  const [selectedTxnType, setSelectedTxnType] = useState('Txn to be signed');
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-start gap-20 flex-[1_0_0] self-stretch px-10 py-20">
      <div className="gap-10 flex flex-col w-full">
        <div className="flex flex-col items-center gap-2 flex-[1_0_0]">
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-start">
              <div
                onClick={() => router.push('./MultisigDashboard.tsx')}
                className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8 underline cursor-pointer"
              >
                Back to list
              </div>
              <div className="flex gap-2">
                <Image
                  src="/avatarbg.svg"
                  width={32}
                  height={32}
                  alt="Profile-bg"
                />
                <p className="text-white text-[28px] not-italic font-bold leading-[normal]">
                  Pavani
                </p>
                <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-extralight leading-[18px] justify-center flex items-center">
                  Created on 23rd March 2023, 11:34 am
                </p>
              </div>
            </div>
            <div className="items-center flex">
              <button className="primary-btn">Delete Multisig</button>
            </div>
          </div>
          <div className="divider-line"></div>
        </div>
        <div className="px-6 py-0 space-y-2">
          <div className="grid grid-cols-4 gap-2">
            <div className="transaction-card">
              <div className="flex flex-col items-center gap-4 self-stretch">
                <p className="text-white text-center text-xl not-italic font-bold leading-[18px]">
                  120 AKT
                </p>
                <p className="text-[rgba(255,255,255,0.50)] text-center text-xs not-italic font-extralight leading-[18px]">
                  Staked Tokens
                </p>
              </div>
            </div>
            <div className="transaction-card">
              <div className="flex flex-col items-center gap-4 self-stretch">
                <p className="text-white text-center text-xl not-italic font-bold leading-[18px]">
                  120 AKT
                </p>
                <p className="text-[rgba(255,255,255,0.50)] text-center text-xs not-italic font-extralight leading-[18px]">
                  Staked Tokens
                </p>
              </div>
            </div>
            <div className="transaction-card">
              <div className="flex flex-col items-center gap-4 self-stretch">
                <p className="text-white text-center text-xl not-italic font-bold leading-[18px]">
                  120 AKT
                </p>
                <p className="text-[rgba(255,255,255,0.50)] text-center text-xs not-italic font-extralight leading-[18px]">
                  Staked Tokens
                </p>
              </div>
            </div>
            <div className="transaction-card">
              <div className="flex flex-col items-center gap-4 self-stretch">
                <p className="text-white text-center text-xl not-italic font-bold leading-[18px]">
                  120 AKT
                </p>
                <p className="text-[rgba(255,255,255,0.50)] text-center text-xs not-italic font-extralight leading-[18px]">
                  Staked Tokens
                </p>
              </div>
            </div>
          </div>
          <div className="members-card">
            <div className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-extralight leading-[18px] text-left">
              Members
            </div>
            <div className="flex justify-between overflow-scroll">
              {[1, 2, 3, 4, 5, 6, 7].map((data, dataid) => (
                <div key={dataid} className="">
                  <div className="flex space-x-2">
                    <p className="text-white text-xl not-italic font-bold leading-[18px]">
                      C80j....
                    </p>
                    <Image
                      src="/copy.svg"
                      width={24}
                      height={24}
                      alt="copy-icon"
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="flex flex-col gap-6 px-6 py-0 w-full">
        <div className="flex flex-col gap-10">
          <div className="gap-2 flex flex-col">
            <div className="flex justify-between w-full">
              <div className="flex flex-col items-start">
                <div className="text-white text-lg not-italic font-normal leading-[27px]">
                  Transactions
                </div>
                <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-[21px]">
                  Connect your wallet now to access all the modules on resolute{' '}
                </div>
              </div>
              <div className="items-center flex">
                <button className="primary-btn">Create Multisig</button>
              </div>
            </div>
            <div className="divider-line"></div>
          </div>
          <div className="flex gap-4">
            {txnsTypes.map((data, dataid) => (
              <div
                onClick={() => {
                  setSelectedTxnType(data);
                }}
                key={dataid}
                className={`txn-btns text-white text-base not-italic font-normal leading-[normal] ${data === selectedTxnType ? 'bg-[#ffffff14] border-none' : 'border-[rgba(255,255,255,0.50)]'}`}
              >
                {data}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 w-full gap-4">
          {Transactions.map((data, dataid) => (
            <div key={dataid} className="transaction-card w-full">
              <div className="flex items-center justify-between self-stretch">
                <div className="flex flex-col items-start gap-2">
                  <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                    Transaction Name
                  </p>
                  <div className="flex space-x-2">
                    <p className="text-white text-sm not-italic font-normal leading-[normal]">
                      {data.Txnname}
                    </p>
                    <Image
                      src="/copy.svg"
                      width={24}
                      height={24}
                      alt="Copy-icon"
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                    {data.Status === 'pending' ? 'Signed' : 'Status'}
                  </p>
                  {data.Status === 'pending' ? (
                    <div className="flex">
                      <p className="text-white text-sm not-italic font-normal leading-[normal]">
                        {data.Signed.length}
                      </p>
                      <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                        /{data.Threshold}
                      </p>
                    </div>
                  ) : (
                    <div className="flex">
                      {data.Status === 'pending' ? (
                        <p
                          className={`text-white text-sm not-italic font-normal leading-[normal] `}
                        >
                          {data.Status}
                        </p>
                      ) : data.Status === 'Success' ? (
                        <div className="flex space-x-1">
                          <p
                            className={` text-[#2BA472] text-sm not-italic font-normal leading-[normal] `}
                          >
                            {data.Status}
                          </p>
                          <Image
                            src="/greenraw.svg"
                            width={16}
                            height={16}
                            alt="Success-raw"
                          />
                        </div>
                      ) : (
                        <div className="flex space-x-1">
                          <p
                            className={`text-[#F15757] text-sm not-italic font-normal leading-[normal] `}
                          >
                            {data.Status}
                          </p>

                          <Image
                            src="/redraw.svg"
                            width={16}
                            height={16}
                            alt="Failed-raw"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6 justify-center">
                  {data.Status === 'pending' ? (
                    data.Threshold === data.Signed.length ? (
                      <button className="primary-btn w-[115px]">
                        Broadcast
                      </button>
                    ) : (
                      <button className="primary-btn w-[115px]">Sign</button>
                    )
                  ) : (
                    <div className="w-[115px]"> </div>
                  )}

                  <Image
                    src="/more.svg"
                    width={24}
                    height={24}
                    alt="More-icon"
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleMultisig;
