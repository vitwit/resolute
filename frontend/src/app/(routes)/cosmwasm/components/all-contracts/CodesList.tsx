import React from 'react';
import CodeItem from './CodeItem';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

const CodesList = (props: { codes: CodeInfo[]; chainID: string }) => {
  const { codes, chainID } = props;
  const { getChainInfo } = useGetChainInfo();
  const { chainLogo } = getChainInfo(chainID);
  return (
    <div className="space-y-6">
      {codes.map((code) => (
        <CodeItem key={code.code_id} code={code} chainLogo={chainLogo} />
      ))}
    </div>
  );
};

export default CodesList;
