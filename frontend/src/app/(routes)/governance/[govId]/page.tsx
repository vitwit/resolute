'use client';

import { useSearchParams, useParams } from 'next/navigation';

import ProposalOverviewVote from '../ProposalOverviewVote';

const Page = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { govId } = params;

  console.log(
    'routes',
    govId,
    searchParams.get('chainId'),
    searchParams.getAll('chainId')
  );
  return <ProposalOverviewVote />;
};

export default Page;
