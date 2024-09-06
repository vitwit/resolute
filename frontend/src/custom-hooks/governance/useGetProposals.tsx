import { useAppSelector } from '../StateHooks';
import useGetChainInfo from '../useGetChainInfo';
import { get } from 'lodash';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import { ProposalsData } from '@/types/gov';
import { voteOptions } from '@/utils/constants';

interface ProposalOverview extends ProposalsData {
  proposalInfo: ProposalsData['proposalInfo'] & {
    proposalDescription: string;
  };
}

const useGetProposals = () => {
  const { getChainInfo } = useGetChainInfo();
  const govState = useAppSelector((state) => state.gov.chains);

  const getProposals = ({
    chainIDs,
    showAll = false,
    deposits = false,
  }: {
    chainIDs: string[];
    showAll?: boolean;
    deposits?: boolean;
  }) => {
    const proposalsData: ProposalsData[] = [];
    chainIDs.forEach((chainID) => {
      const { chainLogo, chainName } = getChainInfo(chainID);
      const activeProposals = govState?.[chainID]?.active?.proposals || [];
      const depositProposals = govState?.[chainID]?.deposit?.proposals || [];

      if (!deposits && Array.isArray(activeProposals)) {
        activeProposals?.forEach((proposal) => {
          const proposalTitle = get(
            proposal,
            'content.title',
            get(proposal, 'title', get(proposal, 'content.@type', ''))
          );

          const endTime = getTimeDifferenceToFutureDate(
            get(proposal, 'voting_end_time')
          );
          const proposalId = get(
            proposal,
            'proposal_id',
            get(proposal, 'id', '')
          );
          proposalsData.push({
            chainID,
            chainName,
            chainLogo,
            isActive: true,
            proposalInfo: {
              proposalTitle,
              proposalId,
              endTime,
            },
          });
        });
      }
      if (showAll) {
        if (Array.isArray(depositProposals)) {
          depositProposals?.forEach((proposal) => {
            const proposalTitle = get(
              proposal,
              'content.title',
              get(proposal, 'title', get(proposal, 'content.@type', ''))
            );
            const endTime = getTimeDifferenceToFutureDate(
              get(proposal, 'deposit_end_time')
            );
            const proposalId = get(
              proposal,
              'proposal_id',
              get(proposal, 'id', '')
            );
            proposalsData.push({
              chainID,
              chainName,
              chainLogo,
              isActive: false,
              proposalInfo: {
                endTime,
                proposalId,
                proposalTitle,
              },
            });
          });
        }
      }

      if (deposits) {
        if (Array.isArray(depositProposals)) {
          depositProposals?.forEach((proposal) => {
            const proposalTitle = get(
              proposal,
              'content.title',
              get(proposal, 'title', get(proposal, 'content.@type', ''))
            );
            const endTime = getTimeDifferenceToFutureDate(
              get(proposal, 'deposit_end_time')
            );
            const proposalId = get(
              proposal,
              'proposal_id',
              get(proposal, 'id', '')
            );
            proposalsData.push({
              chainID,
              chainName,
              chainLogo,
              isActive: false,
              proposalInfo: {
                endTime,
                proposalId,
                proposalTitle,
              },
            });
          });
        }
      }
    });
    return proposalsData;
  };

  const getProposalOverview = ({
    chainID,
    proposalId,
    isActive,
  }: {
    chainID: string;
    proposalId: string;
    isActive: boolean;
  }): ProposalOverview => {
    const { chainLogo, chainName } = getChainInfo(chainID);
    const activeProposals = govState?.[chainID]?.active?.proposals;
    const depositProposals = govState?.[chainID]?.deposit?.proposals;
    const proposal = isActive
      ? activeProposals?.find(
          (proposal) =>
            get(proposal, 'proposal_id', get(proposal, 'id', '')) === proposalId
        )
      : depositProposals?.find(
          (proposal) =>
            get(proposal, 'proposal_id', get(proposal, 'id', '')) === proposalId
        );
    const proposalTitle = get(
      proposal,
      'content.title',
      get(proposal, 'title', get(proposal, 'content.@type', '-'))
    );
    const endTime = getTimeDifferenceToFutureDate(
      get(proposal, isActive ? 'voting_end_time' : 'deposit_end_time', '-')
    );
    const proposalDescription = get(
      proposal,
      'content.description',
      get(proposal, 'summary', '')
    );

    return {
      chainID,
      chainLogo,
      chainName,
      isActive,
      proposalInfo: {
        endTime,
        proposalId,
        proposalTitle,
        proposalDescription,
      },
    };
  };

  const getVote = ({
    proposalId,
    address,
    chainID,
  }: {
    proposalId: string;
    address: string;
    chainID: string;
  }) => {
    const voteData = govState?.[chainID]?.votes?.proposals?.[proposalId]?.vote;
    if (voteData) {
      const voter = voteData?.voter || '';
      const option = voteData?.option || '';
      if (
        address.length &&
        voter.length &&
        option?.length &&
        address === voter
      ) {
        let votedOption = voteOptions?.[option] || '';
        if (!votedOption.length) {
          votedOption = voteOptions?.[voteData?.options?.[0]?.option] || '';
        }
        return votedOption;
      }
    }

    return '';
  };

  return { getProposals, getProposalOverview, getVote };
};

export default useGetProposals;
