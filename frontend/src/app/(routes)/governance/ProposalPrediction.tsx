import Image from "next/image";

const ProposalPrediction = () => {
  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05]">
      <div className="flex flex-col gap-2">
        <p className="text-b1">Proposal Prediction</p>
        <div className="divider-line"></div>
      </div>
      <div className="flex space-x-2 justify-center">
        <Image src="/tick.png" width={16} height={16} alt="Proposal-passed" />
        <p className="proposal-passed-text">Proposal likely to be passed</p>
        <Image src="info-icon.svg" width={16} height={16} alt="info-icon" />
      </div>
      <div className="flex gap-4 w-full">
        <div className="badge-bg">
          <p className="text-small font-bold">22.98%</p>
          <p className="text-[rgba(255,255,255,0.50)] text-[10px] font-extralight">
            Turnout
          </p>
        </div>
        <div className="badge-bg">
          <p className="text-small font-bold">40%</p>
          <p className="text-[rgba(255,255,255,0.50)] text-[10px] font-extralight">
            Quorum
          </p>
        </div>
      </div>
    </div>
  );
};
export default ProposalPrediction;
