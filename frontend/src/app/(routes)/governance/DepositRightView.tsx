import DepositCollected from "./DepositCollected";
import DepositTimeline from "./DepositTimeline";

const DepositRightView = () => {
  return (
    <div className="flex flex-col h-full gap-10">
    <DepositCollected />
    <DepositTimeline />
    </div>

  );
};
export default DepositRightView;
