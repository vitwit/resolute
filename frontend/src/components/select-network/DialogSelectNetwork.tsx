import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  setChangeNetworkDialogOpen,
  setSelectedNetwork,
} from '@/store/features/common/commonSlice';
import { allNetworksLink, changeNetworkRoute } from '@/utils/util';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import NetworkItem from '../select-network/NetworkItem';
import SearchNetworkInput from './SearchNetworkInput';

const DialogSelectNetwork = () => {
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { getChainNamesAndLogos } = useGetChainInfo();
  const chains = getChainNamesAndLogos();

  const [searchQuery, setSearchQuery] = useState('');

  const pathParts = pathName.split('/');

  const dialogOpen = useAppSelector(
    (state) => state.common.changeNetworkDialog.open
  );
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork
  );
  const walletConnected = useAppSelector((state) => state.wallet.connected);

  const filteredChains = chains.filter((chain) =>
    chain.chainName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onClose = () => {
    dispatch(setChangeNetworkDialogOpen({ open: false, showSearch: false }));
    setSearchQuery('');
  };

  const isSelected = (chainName: string): boolean => {
    return (
      selectedNetwork?.chainName?.toLowerCase() === chainName.toLowerCase()
    );
  };

  useEffect(() => {
    const pathParts = pathName.split('/') || [];
    if (pathParts.includes('validator')) {
      dispatch(setSelectedNetwork({ chainName: '' }));
    } else if (pathParts.length >= 3) {
      dispatch(setSelectedNetwork({ chainName: pathParts[2].toLowerCase() }));
    } else {
      dispatch(setSelectedNetwork({ chainName: '' }));
    }
  }, [pathName]);

  const constructUrlWithQueryParams = (newChain: string) => {
    const queryParams = new URLSearchParams(searchParams);
    const baseUrl = changeNetworkRoute(pathName, newChain);
    return `${baseUrl}?${queryParams.toString()}`;
  };

  const constructAllNetworksUrl = (pathParts: string[]) => {
    const queryParams = new URLSearchParams(searchParams);
    return `${allNetworksLink(pathParts)}?${queryParams.toString()}`;
  };

  return (
    <Dialog
      open={dialogOpen}
      maxWidth="lg"
      sx={{
        '& .MuiDialog-paper': {
          color: 'white',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: '#1c1c1d',
        },
      }}
      onClose={onClose}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="select-network-popup">
          <div className="flex justify-end">
            <button onClick={onClose} className="secondary-btn h-10">
              Close
            </button>
          </div>
          <div className="space-y-6">
            <div className="text-center">
              <div className="font-bold text-[28px] leading-normal">
                Select Network
              </div>
              <div className="secondary-text">
                List of the networks supported on Resolute
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <div className="search-network-field ">
                <SearchNetworkInput
                  handleSearchQueryChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  searchQuery={searchQuery}
                />
              </div>
              {walletConnected ? (
                <button className="primary-btn w-fit">Add Network</button>
              ) : null}
            </div>
          </div>
          <Link
            href={constructAllNetworksUrl(pathParts)}
            onClick={() => {
              dispatch(setSelectedNetwork({ chainName: '' }));
              onClose();
            }}
            className={`network-item justify-center ${selectedNetwork.chainName?.length ? '' : 'bg-[#FFFFFF14] !border-transparent'}`}
          >
            <div className="p-1">
              <Image
                src="/icons/all-networks-icon.png"
                height={24}
                width={24}
                alt=""
              />
            </div>
            <h3 className={`text-[14px] leading-normal opacity-100`}>
              <span className={`font-light`}>All Networks</span>
            </h3>
          </Link>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="secondary-text">All Networks</div>
              <div className="divider-line"></div>
            </div>
            <div className="grid grid-cols-5 gap-x-6 gap-y-4">
              {filteredChains.map((chain) => (
                <NetworkItem
                  key={chain.chainID}
                  chainName={chain.chainName}
                  chainLogo={chain.chainLogo}
                  pathName={constructUrlWithQueryParams(chain.chainName)}
                  handleClose={onClose}
                  selected={isSelected(chain.chainName)}
                />
              ))}
            </div>
            {filteredChains?.length === 0 && (
              <div className="text-center">
                <div className="secondary-text">- No Networks Found -</div>
              </div>
            )}
          </div>
          <div className="h-10"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSelectNetwork;
