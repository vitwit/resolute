import './style.css';

const CastVote = () => {
  return (
    <div className="cast-vote-grid ">
      <div className="flex px-6 py-4 rounded-2xl bg-[#FFFFFF05] justify-between w-full">
        <p className="text-b1">Caste your vote</p>
        <p className="text-small-light">Voting ends in 4 days</p>
      </div>
      <div className="flex gap-6 w-full">
        <button className="vote-optn-btn w-[50%] text-base border-[#2BA472]">
          Yes
        </button>
        <button className="vote-optn-btn w-[50%] text-base border-[#D92101]">
          No
        </button>
      </div>
      <div className="flex gap-6 w-full">
        <button className="vote-optn-btn w-[50%] text-base border-[#DA561E]">
          Abstain
        </button>
        <button className="vote-optn-btn w-[50%] text-base border-[#FFC13C]">
          Veto
        </button>
      </div>
      <div className="primary-btn w-full">Vote</div>
    </div>
  );
};
export default CastVote;
