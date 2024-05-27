import Image from 'next/image';
import ValidatorTable from './ValidatorTable';
type AssetSummary = { icon: string; alt: string; type: string; amount: string };
const StakingDashbrd = () => {
  const assetsSummaryData: AssetSummary[] = [
    {
      icon: '/stakedamount.png',
      alt: 'stake',
      type: 'Staked Amount',
      amount: 'staked',
    },
    {
      icon: '/rewards.png',
      alt: 'rewards',
      type: 'Rewards',
      amount: 'rewards',
    },
    {
      icon: '/avbal.png',
      alt: 'available',
      type: 'Available',
      amount: 'available',
    },
    {
      icon: '/unbonding.png',
      alt: 'total',
      type: 'Total',
      amount: 'total',
    },
  ];
  return (
    <div className="flex flex-col items-start gap-20 flex-[1_0_0] self-stretch px-10 py-20">
      <div className="flex flex-col w-full gap-10">
        <div className="space-y-2 items-start">
          <div className="text-white text-[28px] not-italic font-bold leading-[normal]">
            Staking
          </div>
          <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
            Connect your wallet now to access all the modules on resolute{' '}
          </div>
          <div className="horizontal-line"></div>
        </div>
        <div className="flex gap-6 self-stretch px-6 py-0">
          <div className="grid grid-cols-4 gap-4 w-full">
            {assetsSummaryData.map((data, index) => (
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
                    <div className="text-white text-xl not-italic font-bold leading-[18px]">
                      {data.amount}
                    </div>
                    <div className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-light leading-[18px]">
                      {data.type}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unbonding */}
      <div className="flex flex-col w-full gap-10">
        <div className="space-y-2 items-start">
          <div className="text-white text-[28px] not-italic font-bold leading-[normal]">
            Unbonding
          </div>
          <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
            Connect your wallet now to access all the modules on resolute{' '}
          </div>
          <div className="horizontal-line"></div>
        </div>
        <div className="grid grid-cols-3 gap-10 px-6 py-0">
          {[1, 2, 3].map((data, dataid) => (
            <div key={dataid} className="cards">
              <div className="flex items-start justify-between self-stretch">
                <div className="flex space-x-2">
                  <Image
                    src="/cosmostation.png"
                    width={24}
                    height={24}
                    alt="cosmostation-logo"
                  />
                  <p className="text-white text-base not-italic font-normal leading-[normal]">
                    Cosmostation
                  </p>
                </div>
                <div className="">
                  <button className="custom-btn text-white text-center text-sm not-italic font-light leading-[normal]">
                    Cancel
                  </button>
                </div>
              </div>
              <div className="flex justify-between self-stretch">
                <div className="flex flex-col items-start gap-2">
                  <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                    Network
                  </p>
                  <p className="text-white text-sm not-italic font-normal leading-[normal]">
                    Akash
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                    Avail Days
                  </p>
                  <p className="text-white text-sm not-italic font-normal leading-[normal]">
                    21 Days
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                    Amount
                  </p>
                  <p className="text-white text-sm not-italic font-normal leading-[normal]">
                    0.9876 AKT
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delegations */}
      <div className="flex flex-col w-full gap-10">
        <div className="space-y-2 items-start">
          <div className="text-white text-[28px] not-italic font-bold leading-[normal]">
            Delegations
          </div>
          <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
            Connect your wallet now to access all the modules on resolute{' '}
          </div>
          <div className="horizontal-line"></div>
        </div>
        <div className="flex flex-col items-start gap-4 self-stretch px-6 py-0">
          <div className="flex justify-between w-full">
            <div className="flex space-x-4">
              <div className="space-x-2 flex">
                <Image
                  src="/akash-logo.svg"
                  width={32}
                  height={32}
                  alt="akash-logo"
                />
                <p className="text-white text-base not-italic font-normal leading-8">
                  Akash Staking
                </p>
              </div>
              <div className="red-button text-white text-[10px] not-italic font-light leading-6">
                Total staked : 20 AKT{' '}
              </div>
            </div>
            <div className="">
              <button className="primary-btn cursor-pointer">Claim 12.4.5 AKT</button>
            </div>
          </div>
          <div className="grid grid-cols-1 w-full gap-4">
            {[1, 2, 3].map((data, dataid) => (
              <div key={dataid} className="delegations-card w-full">
                <div className="flex items-center justify-between self-stretch">
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                      Validator Name
                    </p>
                    <p className="text-white text-sm not-italic font-normal leading-[normal]">
                      Cosmostation
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                      Validator Name
                    </p>
                    <p className="text-white text-sm not-italic font-normal leading-[normal]">
                      Cosmostation
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                      Validator Name
                    </p>
                    <p className="text-white text-sm not-italic font-normal leading-[normal]">
                      Cosmostation
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                      Validator Name
                    </p>
                    <p className="text-white text-sm not-italic font-normal leading-[normal]">
                      Cosmostation
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Validator */}
      <ValidatorTable />
    </div>
  );
};
export default StakingDashbrd;
