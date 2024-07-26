import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setChangeNetworkDialogOpen } from '@/store/features/common/commonSlice';
import {
  ALL_NETWORKS_GRADIENT,
  ALL_NETWORKS_ICON,
  COSMOS_CHAIN_ID,
} from '@/utils/constants';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { shortenMsg, shortenName } from '@/utils/util';
import { Box, Tooltip } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const SelectNetwork = () => {
  const dispatch = useAppDispatch();
  const [walletAddress, setWalletAddress] = useState('');
  const [chainLogo, setChainLogo] = useState(ALL_NETWORKS_ICON);
  const [chainGradient, setChainGradient] = useState('');

  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork
  );
  const allNetworks = useAppSelector((state) => state.common.allNetworksInfo);
  const networks = useAppSelector((state) => state.wallet.networks);
  const nameToChainIDs = useAppSelector((state) => state.common.nameToChainIDs);
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const openChangeNetwork = () => {
    dispatch(setChangeNetworkDialogOpen({ open: true, showSearch: true }));
  };

  useEffect(() => {
    if (selectedNetwork.chainName && allNetworks) {
      const chainID = nameToChainIDs[selectedNetwork.chainName];
      setChainLogo(allNetworks?.[chainID]?.logos?.menu || ALL_NETWORKS_ICON);
      setChainGradient(allNetworks?.[chainID]?.config?.theme?.gradient);
    }
    if (selectedNetwork.chainName && isWalletConnected) {
      const chainID = nameToChainIDs[selectedNetwork.chainName];
      setWalletAddress(networks[chainID]?.walletInfo.bech32Address);
      setChainLogo(allNetworks?.[chainID]?.logos?.menu || ALL_NETWORKS_ICON);
    } else if (!selectedNetwork.chainName) {
      setWalletAddress('');
      setChainLogo(ALL_NETWORKS_ICON);
      setChainGradient('');
    }
    if (!selectedNetwork.chainName && isWalletConnected) {
      setWalletAddress(
        networks?.[COSMOS_CHAIN_ID]?.walletInfo?.bech32Address || ''
      );
    }
  }, [selectedNetwork, isWalletConnected, allNetworks]);

  return (
    <div className="fixed-top w-full">
      <div className="flex gap-2 items-center h-11">
        <Box
          sx={{
            background: chainGradient || ALL_NETWORKS_GRADIENT,
            height: '40px',
            width: '40px',
          }}
          className="network-icon-bg"
        >
          <Image className='rounded-full' src={chainLogo} height={24} width={24} alt="" />
        </Box>
        <div>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={openChangeNetwork}
          >
            <div className="text-[16px] h-6 font-bold text-[#ffffffad] capitalize">
              {shortenName(selectedNetwork.chainName, 15) || 'All Networks'}
            </div>
            <Image
              src="/drop-down-icon.svg"
              width={24}
              height={24}
              alt="dropdown-icon"
              className="opacity-60"
            />
          </div>
          {walletAddress?.length ? (
            <WalletAddress address={walletAddress} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SelectNetwork;

export const WalletAddress = ({
  address,
  displayAddress = true,
}: {
  address: string;
  displayAddress?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLDivElement>) => {
    copyToClipboard(address);
    setCopied(true);
    e.stopPropagation();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (copied) {
      timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className="flex gap-2 items-center">
      {(displayAddress && (
        <div className="text-[#FFFFFF80] text-[12px] leading-[15px]">
          {shortenMsg(address, 15)}
        </div>
      )) ||
        null}

      <Tooltip title="Copied!" placement="right" open={copied}>
        <Image
          className="cursor-pointer flex items-center justify-center"
          onClick={handleCopy}
          src={'/icons/copy-icon.svg'}
          width={20}
          height={20}
          alt="copy"
        />
      </Tooltip>
    </div>
  );
};
