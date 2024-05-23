import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setChangeNetworkDialogOpen } from '@/store/features/common/commonSlice';
import { ALL_NETWORKS_ICON } from '@/utils/constants';
import { shortenMsg, shortenName } from '@/utils/util';
import { Box } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

// TODO: Implement select network popup and refactor styles
const SelectNetwork = () => {
  const dispatch = useAppDispatch();
  const [walletAddress, setWalletAddress] = useState('');
  const [chainLogo, setChainLogo] = useState(ALL_NETWORKS_ICON);
  const [chainGradient, setChainGradient] = useState('');

  const openChangeNetwork = () => {
    dispatch(setChangeNetworkDialogOpen({ open: true, showSearch: true }));
  };
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork
  );
  const allNetworks = useAppSelector((state) => state.common.allNetworksInfo);
  const networks = useAppSelector((state) => state.wallet.networks);
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  useEffect(() => {
    if (selectedNetwork.chainName && isWalletConnected) {
      const chainID = nameToChainIDs[selectedNetwork.chainName];
      setChainLogo(allNetworks[chainID].logos.menu);
      setChainGradient(allNetworks[chainID].config.theme.gradient);
      setWalletAddress(networks[chainID].walletInfo.bech32Address);
    } else {
      setWalletAddress('');
      setChainLogo(ALL_NETWORKS_ICON);
    }
  }, [selectedNetwork]);
  return (
    <div className="fixed-top w-full">
      <div className="flex gap-2 items-center">
        <Box
          sx={{
            background: chainGradient,
          }}
          className="network-icon-bg"
        >
          <Image src={chainLogo} height={24} width={24} alt="" />
        </Box>
        <div className="space-y-0">
          <div
            onClick={openChangeNetwork}
            className="text-[16px] leading-[24px] font-bold text-white capitalize"
          >
            {shortenName(selectedNetwork.chainName, 15) || 'All Networks'}
          </div>
          {walletAddress?.length ? (
            <div>
              <span className="text-[#FFFFFF80] text-[12px] leading-[15px]">
                {shortenMsg(walletAddress, 15)}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SelectNetwork;
