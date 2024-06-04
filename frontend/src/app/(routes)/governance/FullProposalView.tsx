import './style.css';
import Image from 'next/image';
import CastVote from './CastVote';
import Banner from './Banner';
import RightSideView from './RightSideView';
import ProposalSummary from './ProposalSummary';

const FullProposalView = () => {
  return (
    <>
      {/* Banner */}

      <Banner />

      <div className="flex items-start gap-10 pt-20 pb-20 px-10 w-full h-full">
        <div className="flex items-start gap-20 w-full">
          <div className="flex flex-col flex-1 justify-between overflow-y-scroll max-h-[80vh]">
            <div className="flex flex-col gap-6">
              <div className="secondary-btn">Go back</div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between w-full">
                  <p className="text-h1">Aave v3.1 Cantina competitione</p>
                  <div className="active-btn text-b1">Active</div>
                </div>
                <div className="flex gap-6 w-full">
                  <div className="flex gap-2 items-center">
                    <p className="text-small-light">By</p>
                    <p className="text-b1">0x2cc1...c54Df1</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-small-light">Voting</p>
                    <p className="text-b1">Ends in 4 days</p>
                  </div>
                  <div className="flex gap-2 items-center">
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

              <ProposalSummary />
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
