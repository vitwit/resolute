'use client';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setSelectedNetwork } from '@/store/features/common/commonSlice';
import { RootState } from '@/store/store';
import { Avatar, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SelectNetwork = () => {
  const [open, setOpen] = useState<boolean>(false);
  const pathName = usePathname();
  const ALL_NETWORKS_LOGO = '/all-networks-icon.png';
  const handleClose = () => {
    setOpen((open) => !open);
  };
  const selectedNetwork = useAppSelector(
    (state: RootState) => state.common.selectedNetwork
  );
  const [chainName, setChainName] = useState('');
  const [chainLogo, setChainLogo] = useState(ALL_NETWORKS_LOGO);
  const [walletAddress, setWalletAddress] = useState('');
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    const pathParts = pathName.split('/') || [];
    if (pathParts.length === 3) {
      dispatch(setSelectedNetwork({ chainName: pathParts[2].toLowerCase() }));
    } else {
      dispatch(setSelectedNetwork({ chainName: '' }));
    }
  }, [pathName]);

  useEffect(() => {
    if (selectedNetwork.chainName) {
      const chainID = nameToChainIDs[selectedNetwork.chainName];

      setChainName(selectedNetwork.chainName.toLowerCase());
      setChainLogo(networks[chainID].network.logos.menu);
      setWalletAddress(networks[chainID].walletInfo.bech32Address);
    } else {
      setChainName('All Networks');
      setChainLogo(ALL_NETWORKS_LOGO);
      setWalletAddress('');
    }
  }, [selectedNetwork]);
  return (
    <div>
      <div className="flex gap-2 items-center cursor-pointer">
        <Image src={chainLogo} height={32} width={32} alt="All Networks" />
        {/* TODO: Integrate copy to clipboard */}
        {walletAddress ? (
          <div className="wallet-address">
            <span className="truncate">{walletAddress}</span>
            <Image src="/copy.svg" width={16} height={16} alt="copy" />
          </div>
        ) : (
          <>
            <div className="text-md font-medium leading-nomral text-white">
              All Networks
            </div>
          </>
        )}
        <div onClick={() => setOpen(true)}>
          <Image
            src="/drop-down-icon.svg"
            height={16}
            width={16}
            alt="Select Network"
          />
        </div>
      </div>
      <DialogSelectNetwork
        open={open}
        handleClose={handleClose}
        selectedNetworkName={selectedNetwork.chainName}
      />
    </div>
  );
};

export default SelectNetwork;

const DialogSelectNetwork = ({
  open,
  handleClose,
  selectedNetworkName,
}: {
  open: boolean;
  handleClose: () => void;
  selectedNetworkName: string;
}) => {
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const chainIDs = Object.keys(networks);
  const pathName = usePathname();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          opacity: '0.95',
          background: 'linear-gradient(90deg, #704290 0.11%, #241b61 70.28%)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="pb-12 select-network">
          <div className="px-10 py-6 flex justify-end">
            <div
              onClick={() => {
                handleClose();
              }}
            >
              <Image
                className="cursor-pointer"
                src="/close-icon.svg"
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="py-6 px-10">
            <div className="flex justify-between">
              <div className="flex gap-6 items-center">
                <h2 className="text-[20px] font-bold leading-normal">
                  All Networks
                </h2>
                <div className="text-[14px] leading-normal font-light flex gap-2">
                  <input type="checkbox" name="" id="" />
                  <div>Select All Networks</div>
                </div>
              </div>
              <div>
                <button className="add-network-button">Add New Network</button>
              </div>
            </div>
            <div className="networks-list">
              {chainIDs.map((chainID, index) => (
                <NetworkItem
                  key={index}
                  chainName={networks[chainID].network.config.chainName}
                  logo={networks[chainID].network.logos.menu}
                  pathName={pathName}
                  selectedNetworkName={selectedNetworkName}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const NetworkItem = ({
  chainName,
  logo,
  pathName,
  selectedNetworkName,
}: {
  chainName: string;
  logo: string;
  pathName: string;
  selectedNetworkName: string;
}) => {
  const route = pathName === '/' ? '/overview' : '/' + pathName.split('/')?.[1];
  const dispatch = useAppDispatch();
  const isSelected = (): boolean => {
    return selectedNetworkName.toLowerCase() === chainName.toLowerCase();
  };
  return (
    <Link
      href={`${route}/${chainName.toLowerCase()}`}
      onClick={() => {
        dispatch(setSelectedNetwork({ chainName: chainName.toLowerCase() }));
      }}
      className={
        isSelected()
          ? 'network-item border-[#ffffff6c] border-[0.1px]'
          : 'network-item'
      }
    >
      <Avatar src={logo} sx={{ width: 32, height: 32 }} />
      <h3 className={`text-[14px] leading-normal opacity-100`}>
        <span className={isSelected() ? ` font-semibold` : ` font-light`}>
          {chainName}
        </span>
      </h3>
    </Link>
  );
};
