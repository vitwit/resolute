import Image from "next/image";

const ProposalTimeline =() => {
    return (
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
    )
}
export default ProposalTimeline;