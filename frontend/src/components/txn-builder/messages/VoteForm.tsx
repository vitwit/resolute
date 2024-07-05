import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getProposalsInVoting } from '@/store/features/gov/govSlice';
import ProposalsList from '../components/ProposalsList';
import useGov from '@/custom-hooks/txn-builder/useGov';
import VoteOptionsList from '../components/VoteOptionsList';
import { msgVoteTypeUrl } from '@/txns/gov/vote';
import FileUpload from '../components/FileUpload';

interface VoteProps {
  fromAddress: string;
  onVote: (payload: Msg) => void;
  chainID: string;
  cancelAddMsg: () => void;
}

const VoteForm = (props: VoteProps) => {
  const { fromAddress, onVote, chainID, cancelAddMsg } = props;
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

  const { handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      proposalID: '',
      voteOption: '',
      from: fromAddress,
    },
  });

  const handleProposalChange = (option: ProposalOption | null) => {
    setValue('proposalID', option?.value || '');
    setSelectedOption(option);
  };
  const handleVoteChange = (option: VoteOption | null) => {
    setValue('voteOption', option?.value?.toString() || '');
    setSelectedVoteOption(option);
  };

  const onSubmit = (data: {
    proposalID: string;
    voteOption: string;
    from: string;
  }) => {
    const msgVote = {
      voter: data.from,
      option: Number(data.voteOption),
      proposalId: Number(data.proposalID),
    };

    const msg = {
      typeUrl: msgVoteTypeUrl,
      value: msgVote,
    };

    onVote(msg);
    reset();
    handleProposalChange(null);
    handleVoteChange(null);
  };

  const handleAddMsgs = (msgs: Msg[]) => {
    for (const msg of msgs) {
      onVote(msg);
    }
  };

  useEffect(() => {
    if (chainID) {
      dispatch(
        getProposalsInVoting({ chainID, baseURL, govV1, baseURLs, voter: '' })
      );
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between h-full"
    >
      <div className="space-y-6">
        <div className="bg-[#FFFFFF05] rounded-2xl space-y-2">
          <div className="bg-[#FFFFFF05] rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="text-b1">Vote</div>
            <button
              className="secondary-btn"
              onClick={cancelAddMsg}
              type="button"
            >
              Cancel
            </button>
          </div>
          <div className="space-y-6 px-6 pb-6">
            <div className="flex-1 space-y-2">
              <div className="text-b1-light">Select Proposal</div>
              <ProposalsList
                dataLoading={proposalsLoading}
                handleChange={handleProposalChange}
                options={activeProposalsList}
                selectedOption={selectedOption}
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-b1-light">Select Vote</div>
              <VoteOptionsList
                handleChange={handleVoteChange}
                selectedOption={selectedVoteOption}
              />
            </div>
          </div>
        </div>
        <FileUpload
          fromAddress={fromAddress}
          msgType="Vote"
          onUpload={handleAddMsgs}
        />
      </div>
      <div>
        <button className="primary-btn w-full">Add</button>
      </div>
    </form>
  );
};

export default VoteForm;
