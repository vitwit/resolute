import './style.css';
import Image from 'next/image';
import { useState } from 'react';
import CastVote from './CastVote';
import Banner from './Banner';
import RightSideView from './RightSideView';

const ProposalSummary = ` Following a successful implementation of Phase I of our plan
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
respectively.`;

const FullProposalView = () => {
  const [showFullText, setShowFullText] = useState(false);

  const handleToggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <>
      {/* Banner */}

      <Banner />

      <div className="flex items-start gap-10 pt-20 pb-0 px-10 w-full h-full">
        <div className="flex items-start gap-20 w-full h-full">
          <div className="flex flex-col flex-1 justify-between h-full">
            <div className="flex flex-col gap-6">
              <div className="secondary-btn">Go back</div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between w-full">
                  <p className="text-h1">Aave v3.1 Cantina competitione</p>
                  <div className="active-btn text-b1">Active</div>
                </div>
                <div className="flex gap-6 w-full">
                  <div className="flex gap-2">
                    <p className="text-small-light">By</p>
                    <p className="text-b1">0x2cc1...c54Df1</p>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-small-light">Voting</p>
                    <p className="text-b1">Ends in 4 days</p>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-small-light">on</p>
                    <Image
                      src="/akash-logo.svg"
                      width={20}
                      height={20}
                      alt="Network-logo"
                    />
                    <p className="text-b1">Akash</p>
                  </div>
                </div>
                <div className="divider-line"></div>
              </div>
              <div className="text-h2">
                <p>
                  Title: [ARFC-Addendum] Update Merit for Round 4 Date:
                  2024-05-09 <br />
                  Author: ACI (Aave-chan Initiative)
                </p>
              </div>

              <div className="text-b1-light h-[40vh]  flex flex-col justify-between relative">
                <p
                  className={`h-[40vh] ${showFullText ? 'overflow-scroll' : 'overflow-hidden'}`}
                >
                  {ProposalSummary}
                </p>

                {showFullText ? (
                  <p
                    onClick={handleToggleText}
                    className="cursor-pointer text-b1 justify-center underline flex space-x-1 items-center"
                  >
                    Show Less
                    <Image
                      src="/up.svg"
                      width={24}
                      height={24}
                      alt="Less-icon"
                    />
                  </p>
                ) : (
                  <div className="h-32 w-full relative flex">
                    <div
                      onClick={handleToggleText}
                      className="cursor-pointer justify-center w-full bottom-14 absolute flex z-10 text-b1 underline  space-x-1"
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
                    <div className="blur w-full absolute bottom-0  h-32"> </div>
                  </div>
                )}
              </div>
            </div>

            <CastVote />
          </div>

          {/* RightSide View */}

          <RightSideView />
        </div>
      </div>
    </>
  );
};
export default FullProposalView;
