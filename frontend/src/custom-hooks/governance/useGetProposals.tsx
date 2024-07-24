import { useAppSelector } from '../StateHooks';
import useGetChainInfo from '../useGetChainInfo';
import { get } from 'lodash';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import { ProposalsData } from '@/types/gov';

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
    deposits?:boolean
  }) => {
    const proposalsData: ProposalsData[] = [];
    chainIDs.forEach((chainID) => {
      const { chainLogo, chainName } = getChainInfo(chainID);
      const activeProposals = govState?.[chainID]?.active?.proposals || [];
      const depositProposals = govState?.[chainID]?.deposit?.proposals || [];

      if (!deposits &&  Array.isArray(activeProposals)) {
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
        const proposalsData: ProposalsData[] = [];
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
  return { getProposals, getProposalOverview };
};

export default useGetProposals;
