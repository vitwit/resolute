import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import Contracts from './all-contracts/Contracts';
import Codes from './all-contracts/Codes';

const AllContracts = (props: { chainID: string }) => {
  const { chainID } = props;
  const { getChainInfo } = useGetChainInfo();
  const { restURLs, chainName } = getChainInfo(chainID);

  const selectedCodeId = useSearchParams().get('code_id');

  return (
    <div>
      {selectedCodeId ? (
        <Contracts
          codeId={selectedCodeId}
          chainID={chainID}
          baseURLs={restURLs}
          chainName={chainName}
        />
      ) : (
        <Codes chainID={chainID} baseURLs={restURLs} />
      )}
    </div>
  );
};

export default AllContracts;
