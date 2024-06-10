'use client';

import { useAppSelector } from '@/custom-hooks/StateHooks';
import '../../style.css';
import { useParams } from 'next/navigation';
import { RootState } from '@/store/store';
import SingleProposal from './SingleProposal';

interface pageInterface{}


const SingleProposalComponent = () => {
  const params = useParams();
  const { network, proposalId: id } = params;
  const chainName = typeof network === 'string' ? network : '';
  const proposalId = typeof id === 'string' ? id : '';
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const validChain = Object.keys(nameToChainIDs).some(
    (chain) => chainName.toLowerCase() === chain.toLowerCase()
  );

  // const chainID = Object.keys(nameToChainIDs).find(
  //   (chain) => chain === chainName.toLowerCase()
  // );

  const chainID = nameToChainIDs[chainName]


  const validId = () => {
    const parsedValue = parseInt(proposalId, 10);
    return !isNaN(parsedValue) && Number.isInteger(parsedValue);
  };

 

  return (
    <>
      {!validChain ? (
        <div>- Chain not found -</div>
      ) : !validId() ? (
        <div>- Invalid Proposal ID -</div>
      ) : <SingleProposal chainID={chainID || ''} proposalID={proposalId} /> }
    </>
  )
}


const page: React.FC<pageInterface> = () => {
  return (
    <SingleProposalComponent />
  )
};
export default page;