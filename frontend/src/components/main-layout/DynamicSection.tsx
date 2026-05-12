import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { usePathname } from 'next/navigation';
import React from 'react';

const DynamicSection = ({ children }: { children: React.ReactNode }) => {
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );

  return selectedNetwork ? (
    <NetworkSupport>{children}</NetworkSupport>
  ) : (
    <>{children}</>
  );
};

export default DynamicSection;

const NetworkSupport = ({ children }: { children: React.ReactNode }) => {
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const nameToChainIDs = useAppSelector((state) => state.common.nameToChainIDs);
  const chainID = nameToChainIDs?.[selectedNetwork.toLowerCase()];

  return chainID ? (
    <Module chainID={chainID}>{children}</Module>
  ) : (
    <div>Network not supported</div>
  );
};


// TODO: Implement module not supported screen 
const Module = ({
  children,
  chainID,
}: {
  children: React.ReactNode;
  chainID: string;
}) => {
  const pathName = usePathname().toLowerCase();
  const { getChainInfo } = useGetChainInfo();
  const { enableModules } = getChainInfo(chainID);

  const renderModuleContent = () => {
    if (pathName.includes('feegrant') && !enableModules.feegrant) {
      return <div>Feegrant is not supported</div>;
    }

    if (pathName.includes('authz') && !enableModules.authz) {
      return <div>Authz is not supported</div>;
    }

    return <>{children}</>;
  };

  return renderModuleContent();
};
