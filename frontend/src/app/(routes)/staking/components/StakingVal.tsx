import Image from 'next/image';

const StakingVal = () => {
  return (
    <div className="flex flex-col items-center gap-10 self-stretch">
      <div className="flex items-start gap-10 flex-[1_0_0] self-stretch px-10 py-20">
        <div className="space-y-2">
          <div className="text-h1">
            Staking
          </div>
          <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-[21px]">
            Connect your wallet now to access all the modules on resolute{' '}
          </div>
          <div className="horizontal-line w-full"></div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 flex-[1_0_0]">
        <Image
          src="/dashboard.png"
          width={368}
          height={213}
          alt="Dashboard-Image"
        />
        <div className="custom-btn">
          <button className="text-center text-sm not-italic font-light leading-[normal]">
            Connect your wallet here
          </button>
        </div>
      </div>
      {/* <ValidatorTable /> */}
    </div>
  );
};
export default StakingVal;
