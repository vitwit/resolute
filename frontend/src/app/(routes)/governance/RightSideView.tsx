import Image from 'next/image';

const RightSideView = () => {
  return (
    <div className="flex flex-col justify-between h-full gap-5">
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

      <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05]">
        <div className="flex flex-col gap-2">
          <p className="text-b1">Proposal Timeline</p>
          <div className="divider-line"></div>
        </div>
        <div className="">
          <div className="flex gap-4">
            <div className="flex flex-col justify-center items-center">
              <Image
                src="/radio-plain.svg"
                width={12}
                height={12}
                alt="Proposal-Created"
              />
              <div className="vertical-line "></div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#FFFFFF50] text-[10px]">
                23rd October 2023, 4:11 pm
              </p>
              <p className="text-white text-xs">Proposal Created</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col justify-center items-center">
              <Image
                src="/radio-clr.svg"
                width={12}
                height={12}
                alt="Proposal-Created"
              />
              <div className="vertical-line"></div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#FFFFFF50] text-[10px]">
                23rd October 2023, 4:11 pm
              </p>
              <p className="text-white text-xs">Voting started</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col">
              <Image
                src="/radio-plain.svg"
                width={12}
                height={12}
                alt="Proposal-Created"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#FFFFFF50] text-[10px]">
                23rd October 2023, 4:11 pm
              </p>
              <p className="text-white text-xs">Voting started</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05]">
        <div className="flex flex-col gap-2">
          <p className="text-b1">Current Status</p>
          <div className="divider-line"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 items-center">
            <p className="text-white text-xs">12,547686,233</p>
            <p className="text-[#FFFFFF50] text-[10px]">Voted Yes</p>
          </div>
          <div className="flex space-x-2">
            <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
              <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex left-[224px]"></div>
              <div
                style={{ width: 80 }}
                className={`yes-bg h-2 rounded-l-full `}
              ></div>
            </div>
            <Image src="/tick.png" width={12} height={12} alt="tick-icon" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 items-center">
            <p className="text-white text-xs">12,547686,233</p>
            <p className="text-[#FFFFFF50] text-[10px]">Voted No</p>
          </div>
          <div className="flex space-x-2 items-center">
            <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
              <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex left-[224px]"></div>
              <div
                style={{ width: 40 }}
                className={`no-bg h-2 rounded-l-full `}
              ></div>
            </div>
            <p className="text-[#FFFFFF50] text-[10px]">12%</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 items-center">
            <p className="text-white text-xs">12,547686,233</p>
            <p className="text-[#FFFFFF50] text-[10px]">Voted Abstain</p>
          </div>
          <div className="flex space-x-2 items-center">
            <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
              <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex left-[224px]"></div>
              <div
                style={{ width: 40 }}
                className={`abstain-bg h-2 rounded-l-full `}
              ></div>
            </div>
            <p className="text-[#FFFFFF50] text-[10px]">12%</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 items-center">
            <p className="text-white text-xs">12,547686,233</p>
            <p className="text-[#FFFFFF50] text-[10px]">Voted Veto</p>
          </div>
          <div className="flex space-x-2 items-center">
            <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
              <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex left-[224px]"></div>
              <div
                style={{ width: 40 }}
                className={`veto-bg h-2 rounded-l-full `}
              ></div>
            </div>
            <p className="text-[#FFFFFF50] text-[10px]">12%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RightSideView;
