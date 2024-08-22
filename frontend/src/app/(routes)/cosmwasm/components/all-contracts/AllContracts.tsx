import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Contracts from './Contracts';
import Codes from './Codes';

const AllContracts = (props: { chainID: string }) => {
  const { chainID } = props;
  const { getChainInfo } = useGetChainInfo();
  const { restURLs, chainName } = getChainInfo(chainID);

  const paramCodeId = useSearchParams().get('code_id');

  const [selectedCodeId, setSelectedCodeId] = useState(paramCodeId);

  useEffect(() => {
    setSelectedCodeId(paramCodeId);
  }, [paramCodeId]);

  return (
    <div className="py-10 h-full min-h-[100vh]">
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
