import './style.css';
import Image from 'next/image';
import { useState } from 'react';

const FullProposalView = () => {
  const [showFullText, setShowFullText] = useState(false);

  const handleToggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <>
      {/* Banner */}
      <div className="fixed w-full bg-[#ffc13c] gap-2 px-6 py-3 flex items-center">
        <Image src="/infoblack.svg" width={24} height={24} alt="info-icon" />
        <p className="text-[#1C1C1D] text-sm font-semibold leading-[normal]">
          Important
        </p>
        <p className="text-[#1C1C1D] text-sm font-normal leading-[normal]">
          Voting ends in 03 Days
        </p>
      </div>

      <div className="flex items-start gap-10 pt-20 pb-0 px-10 w-full h-full">
        <div className="flex items-start gap-20 w-full h-full">
          <div className="flex flex-col flex-1 justify-between h-full">
            <div className="flex flex-col gap-6">
              <div className="secondary-btn">Go back</div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between w-full">
                  <p className="text-white text-[28px] font-bold leading-[normal]">
                    Aave v3.1 Cantina competitione
                  </p>
                  <div className="active-btn text-white text-sm font-normal leading-[normal]">
                    Active
                  </div>
                </div>
                <div className="flex gap-6 w-full">
                  <div className="flex gap-2">
                    <p className="text-[rgba(255,255,255,0.50)] text-xs font-extralight leading-[normal]">
                      By
                    </p>
                    <p className="text-white text-sm font-normal leading-[normal]">
                      0x2cc1...c54Df1
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-[rgba(255,255,255,0.50)] text-xs font-extralight leading-[normal]">
                      Voting
                    </p>
                    <p className="text-white text-sm font-normal leading-[normal]">
                      Ends in 4 days
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-[rgba(255,255,255,0.50)] text-xs font-extralight leading-[normal]">
                      on
                    </p>
                    <Image
                      src="/akash-logo.svg"
                      width={20}
                      height={20}
                      alt="Network-logo"
                    />
                    <p className="text-white text-sm font-normal leading-[normal]">
                      Akash
                    </p>
                  </div>
                </div>
                <div className="divider-line"></div>
              </div>
              <div className="text-white">
                <p>
                  Title: [ARFC-Addendum] Update Merit for Round 4 Date:
                  2024-05-09 <br />
                  Author: ACI (Aave-chan Initiative)
                </p>
              </div>
              <div className="text-white h-full">
                {showFullText ? (
                  <p>
                    Following a successful implementation of Phase I of our plan
                    to reduce stablecoin LTs and LTVs, we would like to propose
                    the next phase. Additionally, we have updated our
                    recommended final state for all associated stablecoins, with
                    LTVs and LTs harmonized across all chains at 75% and 78%,
                    respectively. Additionally, we have updated our recommended
                    final state for all associated stablecoins, with LTVs and
                    LTs harmonized across all chains at 75% and 78%,
                    respectively. Additionally, we have updated our recommended
                    final state for all associated stablecoins, with LTVs and
                    LTs harmonized across all chains at 75% and 78%,
                    respectively.
                  </p>
                ) : (
                  <>
                    <p>
                      Long proposal text goes here... <br />
                    </p>
                    <div className=" relative mt-32 flex items-end justify-center">
                      <div className="blur w-full h-24 "></div>
                      <div
                        onClick={handleToggleText}
                        className="cursor-pointer flex text-lg font-normal leading-[normal] underline  space-x-1 items-center justify-center absolute z-10 "
                      >
                        Continue Reading{' '}
                        <Image
                          src="/down.svg"
                          width={24}
                          height={24}
                          alt="more-icon"
                          className="ml-2"
                        />
                      </div>
                    </div>
                  </>
                )}
                {showFullText && (
                  <p
                    onClick={handleToggleText}
                    className="cursor-pointer text-white text-sm font-normal leading-[normal] underline flex space-x-1 items-center"
                  >
                    Show Less
                    <Image
                      src="/up.svg"
                      width={24}
                      height={24}
                      alt="Less-icon"
                    />
                  </p>
                )}
              </div>
            </div>
            <div className="cast-vote-grid">
              <div className="flex px-6 py-4 rounded-2xl bg-[#FFFFFF05] justify-between w-full">
                <p className="text-white text-xs not-italic font-normal leading-[18px]">
                  Caste your vote
                </p>
                <p className="text-white text-xs font-extralight leading-[18px]">
                  Voting ends in 4 days
                </p>
              </div>
              <div className="flex gap-6 w-full">
                <button className="vote-optn-btn w-[50%] text-white text-base font-normal leading-[normal]">
                  Yes
                </button>
                <button className="vote-optn-btn w-[50%] text-white text-base font-normal leading-[normal]">
                  No
                </button>
              </div>
              <div className="flex gap-6 w-full">
                <button className="vote-optn-btn w-[50%] text-white text-base font-normal leading-[normal]">
                  Abstain
                </button>
                <button className="vote-optn-btn w-[50%] text-white text-base font-normal leading-[normal]">
                  Veto
                </button>
              </div>
              <div className="primary-btn w-full cursor-pointer">Vote</div>
            </div>
          </div>

          {/* RightSide View */}
          <div className="flex flex-col justify-between h-full gap-5">
            <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05]">
              <div className="flex flex-col gap-2">
                <p className="text-white">Proposal Timeline</p>
                <div className="divider-line"></div>
              </div>
              <div className="flex space-x-2 justify-center">
                <Image
                  src="/tick.png"
                  width={16}
                  height={16}
                  alt="Proposal-passed"
                />
                <p className="proposal-passed-text">
                  Proposal likely to be passed
                </p>
                <Image
                  src="info-icon.svg"
                  width={16}
                  height={16}
                  alt="info-icon"
                />
              </div>
              <div className="flex gap-4 w-full">
                <div className="flex justify-center items-center gap-2 px-4 py-2 rounded-[100px] bg-[#FFFFFF05] w-[158px]">
                  <p className="text-white text-xs font-bold leading-[normal]">
                    22.98%
                  </p>
                  <p className="text-[rgba(255,255,255,0.50)] text-[10px] font-extralight leading-[normal]">
                    Turnout
                  </p>
                </div>
                <div className="flex justify-center items-center gap-2 px-4 py-2 rounded-[100px] bg-[#FFFFFF05] w-[158px]">
                  <p className="text-white text-xs font-bold leading-[normal]">
                    22.98%
                  </p>
                  <p className="text-[rgba(255,255,255,0.50)] text-[10px] font-extralight leading-[normal]">
                    Turnout
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05]">
              <div className="flex flex-col gap-2">
                <p className="text-white">Proposal Timeline</p>
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
                    <p className="text-[#FFFFFF80]">
                      23rd October 2023, 4:11 pm
                    </p>
                    <p className="text-white text-xs font-normal leading-[normal]">
                      Proposal Created
                    </p>
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
                    <p className="text-[#FFFFFF80]">
                      23rd October 2023, 4:11 pm
                    </p>
                    <p className="text-white text-xs font-normal leading-[normal]">
                      Voting started
                    </p>
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
                    <p className="text-[#FFFFFF80]">
                      23rd October 2023, 4:11 pm
                    </p>
                    <p className="text-white text-xs font-normal leading-[normal]">
                      Voting started
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05]">
              <div className="flex flex-col gap-2">
                <p className="text-white text-sm font-normal leading-[normal]">
                  Current Status
                </p>
                <div className="divider-line"></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 items-center">
                  <p className="text-white text-xs font-normal leading-[normal]">
                    12,547686,233
                  </p>
                  <p className="secondary-text">Voted Yes</p>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
                    <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex left-[224px]"></div>
                    <div
                      style={{ width: 40 }}
                      className={`bg-[#2DC5A4] h-2 rounded-l-full `}
                    ></div>
                  </div>
                  <Image
                    src="/tick.png"
                    width={12}
                    height={12}
                    alt="tick-icon"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 items-center">
                  <p className="text-white text-xs font-normal leading-[normal]">
                    12,547686,233
                  </p>
                  <p className="secondary-text">Voted No</p>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
                    <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex left-[224px]"></div>
                    <div
                      style={{ width: 40 }}
                      className={`bg-[#2DC5A4] h-2 rounded-l-full `}
                    ></div>
                  </div>
                  <p className="secondary-text">12%</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 items-center">
                  <p className="text-white text-xs font-normal leading-[normal]">
                    12,547686,233
                  </p>
                  <p className="secondary-text">Voted Abstain</p>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
                    <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex left-[224px]"></div>
                    <div
                      style={{ width: 40 }}
                      className={`bg-[#2DC5A4] h-2 rounded-l-full `}
                    ></div>
                  </div>
                  <p className="secondary-text">12%</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 items-center">
                  <p className="text-white text-xs font-normal leading-[normal]">
                    12,547686,233
                  </p>
                  <p className="secondary-text">Voted Veto</p>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
                    <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex left-[224px]"></div>
                    <div
                      style={{ width: 40 }}
                      className={`bg-[#2DC5A4] h-2 rounded-l-full `}
                    ></div>
                  </div>
                  <p className="secondary-text">12%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FullProposalView;
