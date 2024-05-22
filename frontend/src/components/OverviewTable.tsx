'use client';
import './overviewtable.css';
import Image from 'next/image';

const overviewSummaryData = [
  {
    icon: '/stakedamount.png',
    alt: 'stake',
    type: 'Staked Amount',
    amount: '$ 12,0987',
  },
  {
    icon: '/rewards.png',
    alt: 'rewards',
    type: 'Rewards',
    amount: '$ 12,0987',
  },
  {
    icon: '/avbal.png',
    alt: 'availablebalance',
    type: 'Available Balance',
    amount: '$ 12,0987',
  },
  {
    icon: '/unbonding.png',
    alt: 'unbonding',
    type: 'Total unbonding',
    amount: '$ 12,0987',
  },
];

const OverviewTable = ({ address }: { address: string }) => {
  return (
    <div className="background-color flex-col gap-20 px-10 py-20">
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-start gap-2 self-stretch">
          <div className="flex space-x-2">
            <div className="text-black text-[28px] italic font-black leading-[normal] space-x-4">
              Hello
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-2xl not-italic font-normal leading-[normal]">
                {address}
              </p>
              <Image
                src="/copy.svg"
                width={30}
                height={30}
                alt="Copy-Icon"
                loading="lazy"
              />
            </div>
          </div>
          <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
            Connect your wallet now to access all the modules on resolute
          </div>
        </div>

        <div className="flex gap-6 self-stretch px-6 py-0">
          <div className="grid grid-cols-4 gap-4 w-full">
            {overviewSummaryData.map((data, index) => (
              <div key={index} className="dashboard-card">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center">
                    <Image
                      src={data.icon}
                      width={60}
                      height={40}
                      alt={data.alt}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xl not-italic font-bold leading-[18px]">
                      {data.amount}
                    </div>
                    <div className="text-black text-xs not-italic font-extralight leading-[18px]">
                      {data.type}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 self-stretch overflow-scroll">
        <div className="space-y-1">
          <div className="text-black text-lg not-italic font-normal leading-[27px]">
            Asset Information
          </div>
          <div className="text-black text-sm not-italic font-extralight leading-[21px]">
            Connect your wallet now to access all the modules on resolute
          </div>
          <div className="h-line"></div>
        </div>
        <div className="flex text-black flex-col items-start gap-2 self-stretch p-6">
          <table className="relative w-full">
            <thead className="w-full">
              <tr>
                <th className="w-1/6">
                  <div className="text-base not-italic font-normal leading-[normal] items-start">
                    Available
                  </div>
                </th>
                <th className="w-1/6">
                  <div className="text-base not-italic font-normal leading-[normal]">
                    Staked
                  </div>
                </th>
                <th className="w-1/6">
                  <div className="text-base not-italic font-normal leading-[normal]">
                    Rewards
                  </div>
                </th>
                <th className="w-1/6">
                  <div className="text-base not-italic font-normal leading-[normal]">
                    Price
                  </div>
                </th>
                <th className="w-1/6">
                  <div className="text-base not-italic font-normal leading-[normal]">
                    Value
                  </div>
                </th>
                <th className="w-1/6">
                  <div></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((data, dataid) => (
                <tr key={dataid} className="table-border-line">
                  <th className="px-0 py-8">
                    <div className="flex flex-col items-center">
                      <div className="text-base not-italic font-normal leading-[normal]">
                        142.5 Atoms
                      </div>
                      <div className="flex space-x-2">
                        <Image
                          src="/akash-logo.svg"
                          width={16}
                          height={16}
                          alt="Akash-Logo"
                          loading="lazy"
                        />
                        <p className="text-sm not-italic font-extralight leading-[normal]">
                          on akash
                        </p>
                      </div>
                    </div>
                  </th>
                  <th>
                    <div className="text-base not-italic font-normal leading-[normal]">
                      40 atoms
                    </div>
                  </th>
                  <th>
                    <div className="text-base not-italic font-normal leading-[normal]">
                      40 atoms
                    </div>
                  </th>
                  <th>
                    <div className="flex flex-col text-red items-center">
                      <div className="text-base not-italic font-normal leading-[normal]">
                        $ 89.46
                      </div>
                      <div className="flex">
                        <p className="text-[rgba(241,87,87,0.50)] text-sm not-italic font-extralight leading-[normal]">
                          39%
                        </p>
                        <Image
                          src="/down-arrow-filled-icon.svg"
                          width={9}
                          height={5}
                          alt="down-arrow-filled-icon"
                        />
                      </div>
                    </div>
                  </th>
                  <th>
                    <div className="text-base not-italic font-normal leading-[normal]">
                      $ 89.46
                    </div>
                  </th>
                  <th>
                    <div className="items-center justify-center flex">
                      <Image
                        src="/more.svg"
                        width={24}
                        height={24}
                        alt="more-icon"
                        className="cursor-pointer"
                      />
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewTable;
