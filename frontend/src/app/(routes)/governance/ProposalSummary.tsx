import Image from 'next/image';
import { useState } from 'react';

const ProposalSummaryText = ` Following a successful implementation of Phase I of our plan
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

const ProposalSummary = () => {
  const [showFullText, setShowFullText] = useState(false);

  const handleToggleText = () => {
    setShowFullText(!showFullText);
  };
  return (
    <>
      <div className="text-h2">
        <p>
          Title: [ARFC-Addendum] Update Merit for Round 4 Date: 2024-05-09{' '}
          <br />
          Author: ACI (Aave-chan Initiative)
        </p>
      </div>

      <div className="text-b1-light h-[40vh]  flex flex-col justify-between relative">
        <p
          className={`h-[40vh] ${showFullText ? 'overflow-scroll' : 'overflow-hidden'}`}
        >
          {ProposalSummaryText}
        </p>

        {showFullText ? (
          <p
            onClick={handleToggleText}
            className="cursor-pointer text-b1 justify-center underline flex space-x-1 items-center"
          >
            Show Less
            <Image src="/up.svg" width={24} height={24} alt="Less-icon" />
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
    </>
  );
};
export default ProposalSummary;
