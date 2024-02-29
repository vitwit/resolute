'use client';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  setError,
  setSelectedNetwork,
} from '@/store/features/common/commonSlice';
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
import { ALL_NETWORKS_ICON, CHANGE_NETWORK_ICON } from '@/utils/constants';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';

const SelectNetwork = ({ message }: { message?: string }) => {
  const pathName = usePathname();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState<boolean>(false);
  const [addNetworkDialogOpen, setAddNetworkDialogOpen] =
    useState<boolean>(false);
  const [chainLogo, setChainLogo] = useState(ALL_NETWORKS_ICON);
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
    if (pathParts.includes('validator') && pathParts.includes('staking')) {
      dispatch(setSelectedNetwork({ chainName: '' }));
    } else if (pathParts.length >= 3) {
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
      setChainLogo(ALL_NETWORKS_ICON);
      setWalletAddress('');
    }
  }, [selectedNetwork]);

  useEffect(() => {
    if (message?.length) {
      setOpen(true);
    }
  }, [message]);

  return (
    <div>
      <div
        id="select-network"
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Image
          className="rounded-full"
          src={chainLogo}
          height={30}
          width={30}
          alt="All Networks"
        />
        {walletAddress ? (
          <div className="wallet-address">
            <span className="truncate">{walletAddress}</span>
            <Image
              onClick={(e) => {
                copyToClipboard(walletAddress);
                dispatch(
                  setError({
                    type: 'success',
                    message: 'Copied',
                  })
                );
                e.stopPropagation();
              }}
              src="/copy.svg"
              width={24}
              height={24}
              alt="copy"
            />
          </div>
        ) : (
          <>
            <div className="all-networks">
              <span className="truncate">All Networks</span>
            </div>
          </>
        )}
        <div>
          <Image
            src={CHANGE_NETWORK_ICON}
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
        message={message}
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
  message,
}: {
  open: boolean;
  handleClose: () => void;
  selectedNetworkName: string;
  openAddNetworkDialog: () => void;
  message?: string;
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
        sx: dialogBoxPaperPropStyles,
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
          {message?.length ? <div className="message">{message}</div> : null}
          <div className="pb-6 px-10">
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
                  src={ALL_NETWORKS_ICON}
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

  const shortenName = (name: string, maxLength: number): string =>
    name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;

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
