

import SearchBar from './SearchBar';
import TxnView from './TxnView';

const TxnHistoryDashboard = () => {
  return (
    <div className="flex flex-col items-start gap-20 w-full px-10 py-20">
      <div className="flex flex-col w-full gap-10">
        <div className="space-y-2 items-start">
          <div className="text-h1">Transaction History</div>
          <div className="secondary-text">
            Connect your wallet now to access all the modules on resolute{' '}
          </div>
          <div className="horizontal-line"></div>
        </div>
        <div className="flex flex-col w-full px-20 py-0 gap-10">
          <SearchBar />
          <TxnView timeStamp={''}  />
        </div>
      </div>
    </div>
  );
};
export default TxnHistoryDashboard;
