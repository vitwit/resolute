import { useAppSelector } from '../StateHooks';
import { TxStatus } from '@/types/enums';
import { get } from 'lodash';

const useGov = () => {
  const govData = useAppSelector((state) => state.gov.chains);
  const getActiveProposals = ({ chainID }: { chainID: string }) => {
    const activeProposals = govData?.[chainID]?.active?.proposals;
    const proposalsLoading =
      govData?.[chainID]?.active?.status === TxStatus.PENDING;
    const activeProposalsList = [];
    for (let i = 0; i < activeProposals?.length; i++) {
      const proposal = activeProposals[i];
      const proposalTitle = get(
        proposal,
        'content.title',
        get(proposal, 'title', get(proposal, 'content.@type', ''))
      );
      const proposalId = get(proposal, 'proposal_id', get(proposal, 'id', ''));
      const temp = {
        label: proposalTitle,
        value: proposalId,
      };
      activeProposalsList.push(temp);
    }

    return { activeProposalsList, proposalsLoading };
  };
  return { getActiveProposals };
};

export default useGov;
