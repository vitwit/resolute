import Banner from './Banner';
import Image from 'next/image';
import ProposalSummary from './ProposalSummary';
import RightSideView from './RightSideView';
import DepositForm from './DepositForm';
import DepositRightView from './DepositRightView';

const DepositProposal = () => {
  return (
    <>
      <Banner />
      <div className="flex items-start gap-10 pt-20 pb-0 px-10 w-full h-full">
        <div className="flex items-start gap-20 w-full h-full">
          <div className="flex flex-col flex-1 justify-between h-full">
            <div className="flex flex-col gap-6">
              <div className="secondary-btn">Go back</div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between w-full">
                  <p className="text-h1">Aave v3.1 Cantina competitione</p>
                  <div className="deposit-btn text-b1">Deposit</div>
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
            <DepositForm />
          </div>
          {/* RightSideView */}
          <DepositRightView />
        </div>
      </div>
    </>
  );
};
export default DepositProposal;
