import React, { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getProposalsInVoting } from '@/store/features/gov/govSlice';
import ProposalsList from '../components/ProposalsList';
import useGov from '@/custom-hooks/txn-builder/useGov';
import VoteOptionsList from '../components/VoteOptionsList';

const VoteMessage = ({
  index,
  remove,
  setValue,
  chainID,
}: {
  index: number;
  remove: (index: number) => void;
  setValue: UseFormSetValue<TxnBuilderForm>;
  chainID: string;
}) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { baseURL, govV1, restURLs: baseURLs } = getChainInfo(chainID);
  const { getActiveProposals } = useGov();
  const { activeProposalsList, proposalsLoading } = getActiveProposals({
    chainID,
  });
  const [selectedOption, setSelectedOption] = useState<ProposalOption | null>(
    null
  );
  const [selectedVoteOption, setSelectedVoteOption] =
    useState<VoteOption | null>(null);

  const handleChange = (option: ProposalOption | null) => {
    setValue(`msgs.${index}.proposalId`, option?.value || '');
    setSelectedOption(option);
  };
  const handleVoteChange = (option: VoteOption | null) => {
    setValue(`msgs.${index}.option`, option?.value?.toString() || '');
    setSelectedVoteOption(option);
  };

  useEffect(() => {
    if (chainID) {
      dispatch(
        getProposalsInVoting({ chainID, baseURL, govV1, baseURLs, voter: '' })
      );
    }
  }, []);

  return (
    <div className="bg-[#FFFFFF05] rounded-2xl space-y-2">
      <div className="bg-[#FFFFFF05] rounded-2xl px-6 py-4 flex items-center justify-between">
        <div className="text-b1">Vote</div>
        <div className="secondary-btn" onClick={() => remove(index)}>
          Remove
        </div>
      </div>
      <div className="flex items-center gap-6 px-6 pb-6">
        <div className="flex-1 space-y-2">
          <div className="text-b1-light">Select Proposal</div>
          <ProposalsList
            dataLoading={proposalsLoading}
            handleChange={handleChange}
            options={activeProposalsList}
            selectedOption={selectedOption}
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-b1-light">Select Vote Option</div>
          <VoteOptionsList
            handleChange={handleVoteChange}
            selectedOption={selectedVoteOption}
          />
        </div>
      </div>
    </div>
  );
};

export default VoteMessage;
