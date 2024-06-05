import { useAppSelector } from '../StateHooks';
import useGetChainInfo from '../useGetChainInfo';
import { get } from 'lodash';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';

interface ProposalsData {
  chainID: string;
  chainName: string;
  chainLogo: string;
  isActive: boolean;
  proposalInfo: {
    proposalTitle: string;
    endTime: string; // voting end time or deposit end time
    proposalId: string;
  };
}

const useGetProposals = () => {
  const { getChainInfo } = useGetChainInfo();
  const govState = useAppSelector((state) => state.gov.chains);
  const getProposals = ({
    chainIDs,
    showAll = false,
  }: {
    chainIDs: string[];
    showAll?: boolean;
  }) => {
    const proposalsData: ProposalsData[] = [];
    chainIDs.forEach((chainID) => {
      const { chainLogo, chainName } = getChainInfo(chainID);
      const activeProposals = govState?.[chainID]?.active?.proposals;
      const depositProposals = govState?.[chainID]?.deposit?.proposals;

      activeProposals?.forEach((proposal) => {
        const proposalTitle =
          get(proposal, 'content.title', get(proposal, 'title', '-')) ||
          get(proposal, 'content.@type', '');
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
      if (showAll) {
        depositProposals?.forEach((proposal) => {
          const proposalTitle =
            get(proposal, 'content.title', get(proposal, 'title', '-')) ||
            get(proposal, 'content.@type', '');
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
            isActive: false,
            proposalInfo: {
              endTime,
              proposalId,
              proposalTitle,
            },
          });
        });
      }
    });
    return proposalsData;
  };
  return { getProposals };
};

export default useGetProposals;
