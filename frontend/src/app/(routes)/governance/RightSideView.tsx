import ProposalPrediction from './ProposalPrediction';
import ProposalTimeline from './ProposalTimeline';
import ProposalStatus from './ProposalStatus';

const RightSideView = () => {
  return (
    <div className="flex flex-col justify-between gap-2">
      <ProposalPrediction />

      <ProposalTimeline />

      <ProposalStatus />
    </div>
  );
};
export default RightSideView;
