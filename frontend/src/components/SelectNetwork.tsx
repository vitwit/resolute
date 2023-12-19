'use client';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setError, setSelectedNetwork } from '@/store/features/common/commonSlice';
import { RootState } from '@/store/store';
import { Avatar, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DialogAddNetwork from './DialogAddNetwork';
import { resetConnectWalletStatus } from '@/store/features/wallet/walletSlice';
import { allNetworksLink, changeNetworkRoute } from '@/utils/util';
import { copyToClipboard } from '@/utils/copyToClipboard';

const ALL_NETWORKS_LOGO = '/all-networks-icon.png';

const SelectNetwork = () => {
  const pathName = usePathname();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState<boolean>(false);
  const [addNetworkDialogOpen, setAddNetworkDialogOpen] =
    useState<boolean>(false);
  const [chainLogo, setChainLogo] = useState(ALL_NETWORKS_LOGO);
  const [walletAddress, setWalletAddress] = useState('');

  const selectedNetwork = useAppSelector(
    (state: RootState) => state.common.selectedNetwork
  );
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseAddNetworkDialog = () => {
    setAddNetworkDialogOpen(false);
  };
  const openAddNetworkDialog = () => {
    setAddNetworkDialogOpen(true);
  };

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

      setChainLogo(networks[chainID].network.logos.menu);
      setWalletAddress(networks[chainID].walletInfo.bech32Address);
    } else {
      setChainLogo(ALL_NETWORKS_LOGO);
      setWalletAddress('');
    }
  }, [selectedNetwork]);

  return (
    <div>
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Image src={chainLogo} height={32} width={32} alt="All Networks" />
        {/* TODO: Integrate copy to clipboard */}
        {walletAddress ? (
          <div className="wallet-address">
            <span className="truncate">{walletAddress}</span>
            <Image onClick={(e) => {
              copyToClipboard(walletAddress);
              dispatch(setError({
                type: 'success',
                message: "Copied"
              }))
              e.stopPropagation();
            }} src="/copy.svg" width={24} height={24} alt="copy" />
          </div>
        ) : (
          <>
            <div className="text-md font-medium leading-nomral text-white">
              All Networks
            </div>
          </>
        )}
        <div>
          <Image
            src="/new-drop-down-icon.svg"
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
        openAddNetworkDialog={openAddNetworkDialog}
      />
      <DialogAddNetwork
        open={addNetworkDialogOpen}
        handleClose={handleCloseAddNetworkDialog}
      />
    </div>
  );
};

export default SelectNetwork;

const DialogSelectNetwork = ({
  open,
  handleClose,
  selectedNetworkName,
  openAddNetworkDialog,
}: {
  open: boolean;
  handleClose: () => void;
  selectedNetworkName: string;
  openAddNetworkDialog: () => void;
}) => {
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const chainIDs = Object.keys(networks);
  const pathName = usePathname();
  const dispatch = useAppDispatch();
  const pathParts = pathName.split('/');
  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(90deg, #704290 0.11%, #241b61 70.28%)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="pb-12 select-network">
          <div className="px-10 py-10 flex justify-end">
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
            <div className="mb-6 flex justify-between">
              <h2 className="text-[20px] font-bold leading-normal">
                All Networks
              </h2>
              <div>
                <button
                  className="add-network-button gradient-bg"
                  onClick={() => {
                    handleClose();
                    dispatch(resetConnectWalletStatus());
                    openAddNetworkDialog();
                  }}
                >
                  Add New Network
                </button>
              </div>
            </div>
            <Link
              href={allNetworksLink(pathParts)}
              onClick={() => {
                dispatch(setSelectedNetwork({ chainName: '' }));
              }}
              className={
                selectedNetworkName.length
                  ? 'network-item'
                  : 'network-item network-item-selected'
              }
            >
              <div className="flex justify-center items-center w-full gap-2">
                <Image
                  src={ALL_NETWORKS_LOGO}
                  width={26}
                  height={26}
                  alt="All Networks"
                />
                <h3 className={`text-[14px] leading-normal opacity-100`}>
                  <span
                    className={
                      selectedNetworkName.length ? `font-light` : `font-bold`
                    }
                  >
                    Select All Networks
                  </span>
                </h3>
              </div>
            </Link>
            <div className="divider-line"></div>
            <div className="networks-list">
              {chainIDs.map((chainID, index) => (
                <NetworkItem
                  key={index}
                  chainName={networks[chainID].network.config.chainName}
                  logo={networks[chainID].network.logos.menu}
                  pathName={pathName}
                  selectedNetworkName={selectedNetworkName}
                  handleClose={handleClose}
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
  handleClose,
}: {
  chainName: string;
  logo: string;
  pathName: string;
  selectedNetworkName: string;
  handleClose: () => void;
}) => {
  const dispatch = useAppDispatch();

const shortenName = (name: string, maxLength: number): string => name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;

  const isSelected = (): boolean => {
    return selectedNetworkName.toLowerCase() === chainName.toLowerCase();
  };
  return (
    <Link
      href={changeNetworkRoute(pathName, chainName)}
      onClick={() => {
        dispatch(setSelectedNetwork({ chainName: chainName.toLowerCase() }));
        handleClose();
      }}
      className={
        isSelected() ? 'network-item network-item-selected' : 'network-item'
      }
    >
      <Avatar src={logo} sx={{ width: 32, height: 32 }} />
      <h3 className={`text-[14px] leading-normal opacity-100`}>
        <span className={isSelected() ? ` font-semibold` : ` font-light`}>
          {shortenName(chainName, 15)}
        </span>
      </h3>
    </Link>
  );
};
