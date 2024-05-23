import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  setChangeNetworkDialogOpen,
  setSelectedNetwork,
} from '@/store/features/common/commonSlice';
import { allNetworksLink, changeNetworkRoute, shortenName } from '@/utils/util';
import { Avatar, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DialogSelectNetwork = () => {
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const { getChainNamesAndLogos } = useGetChainInfo();

  const pathParts = pathName.split('/');

  const dialogOpen = useAppSelector(
    (state) => state.common.changeNetworkDialog.open
  );

  const walletConnected = useAppSelector((state) => state.wallet.connected);

  const chains = getChainNamesAndLogos();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredChains = chains.filter((chain) =>
    chain.chainName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onClose = () => {
    dispatch(setChangeNetworkDialogOpen({ open: false, showSearch: false }));
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
              <div className="py-4 px-6 bg-[#FFFFFF05] rounded-full flex flex-1">
                <SearchNetworkInput
                  handleSearchQueryChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  searchQuery={searchQuery}
                />
                <Link
                  href={allNetworksLink(pathParts)}
                  onClick={() => {
                    dispatch(setSelectedNetwork({ chainName: '' }));
                    onClose();
                  }}
                >
                  Select All Networks
                </Link>
              </div>
              {walletConnected ? (
                <button className="primary-btn w-fit">Add Network</button>
              ) : null}
            </div>
          </div>
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
                  pathName={pathName}
                  handleClose={onClose}
                />
              ))}
            </div>
          </div>
          <div className="h-10"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSelectNetwork;

const NetworkItem = ({
  chainName,
  chainLogo,
  pathName,
  handleClose,
}: {
  chainName: string;
  chainLogo: string;
  pathName: string;
  handleClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const routePath = pathName.toLowerCase().includes('/validator')
    ? '/staking'
    : pathName;
  return (
    <Link
      href={changeNetworkRoute(routePath, chainName)}
      className="p-2 flex items-center gap-2 border-[0.25px] border-[#ffffff2f] rounded-2xl hover:scale-[1.07]"
      onClick={() => {
        dispatch(setSelectedNetwork({ chainName: chainName.toLowerCase() }));
        handleClose();
      }}
    >
      <div className="p-1">
        <Avatar src={chainLogo} sx={{ width: 24, height: 24 }} />
      </div>
      <h3 className={`text-[14px] leading-normal opacity-100`}>
        <span className={`font-light`}>{shortenName(chainName, 15)}</span>
      </h3>
    </Link>
  );
};

const SearchNetworkInput = ({
  searchQuery,
  handleSearchQueryChange,
}: {
  searchQuery: string;
  handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex gap-2 items-center flex-1">
      <Image src="/search-icon.svg" height={24} width={24} alt="" />
      <input
        type="text"
        placeholder="Search Network"
        value={searchQuery}
        onChange={handleSearchQueryChange}
        className="w-full border-none cursor-text focus:outline-none bg-transparent placeholder:text-[16px] placeholder:text-[#FFFFFF80] placeholder:font-normal text-[#ffffff]"
        autoFocus={true}
      />
    </div>
  );
};
