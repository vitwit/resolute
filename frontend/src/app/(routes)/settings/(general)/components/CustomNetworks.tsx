import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import React from 'react';
import CustomNetworkCard from './CustomNetworkCard';
import EmptyScreen from '@/components/common/EmptyScreen';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setAddNetworkDialogOpen } from '@/store/features/common/commonSlice';

const CustomNetworks = () => {
  const dispatch = useAppDispatch();
  const { getCustomNetworks, getChainInfo } = useGetChainInfo();
  const customNetworks = getCustomNetworks();

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-10 px-6">
        {customNetworks.map((chainID) => {
          const { chainLogo, chainName } = getChainInfo(chainID);
          return (
            <CustomNetworkCard
              key={chainID}
              chainID={chainID}
              chainName={chainName}
              chainLogo={chainLogo}
            />
          );
        })}
      </div>
      <div>
        {!customNetworks?.length && (
          <div className="flex items-center justify-center w-full h-full">
            <EmptyScreen
              title="Add Network"
              description="No custom networks"
              btnText="Add Network"
              btnOnClick={() => {
                dispatch(setAddNetworkDialogOpen(true));
              }}
              hasActionBtn
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomNetworks;
