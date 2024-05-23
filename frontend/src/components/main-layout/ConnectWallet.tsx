import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  establishWalletConnection,
  setConnectWalletOpen,
} from '@/store/features/wallet/walletSlice';
import { networks } from '@/utils/chainsInfo';
import { SUPPORTED_WALLETS } from '@/utils/constants';
import { getLocalNetworks } from '@/utils/localStorage';
import {
  connectSnap,
  experimentalSuggestChain,
  getSnap,
} from '@leapwallet/cosmos-snap-provider';
import { Dialog, DialogContent, Slide, SlideProps } from '@mui/material';
import Image from 'next/image';
import React, { forwardRef } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
const Transition = forwardRef(function Transition(
  props: SlideProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<any>
) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

const ConnectWallet = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.wallet.connectWalletOpen);
  const connectWalletClose = () => {
    dispatch(setConnectWalletOpen(false));
  };

  const selectWallet = (walletName: string) => {
    tryConnectWallet(walletName.toLowerCase());
    connectWalletClose();
  };

  const tryConnectWallet = async (walletName: string) => {
    if (walletName === 'metamask') {
      try {
        for (let i = 0; i < networks.length; i++) {
          const chainId: string = networks[i].config.chainId;
          const snapInstalled = await getSnap();
          if (!snapInstalled) {
            await connectSnap(); // Initiates installation if not already present
          }

          try {
            await experimentalSuggestChain(networks[i].config, {
              force: false,
            });
          } catch (error) {
            console.log('Error while connecting ', chainId);
          }
        }
      } catch (error) {
        console.log('trying to connect wallet ', error);
      }
    }

    dispatch(
      establishWalletConnection({
        walletName,
        networks: [...networks, ...getLocalNetworks()],
      })
    );
  };

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      TransitionComponent={Transition}
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
      onClose={connectWalletClose}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="connect-wallet-popup">
          <div className="flex justify-end p-6">
            <button onClick={connectWalletClose} className="secondary-btn">
              Close
            </button>
          </div>
          <div className="text-center">
            <div className="font-bold text-[28px] leading-normal">
              Connect Wallet
            </div>
            <div className="secondary-text">
              Connect your wallet now to access all the modules on Resolute
            </div>
          </div>
          <div className="grid grid-cols-4 gap-10 px-10">
            {SUPPORTED_WALLETS.map((wallet, index) => (
              <div
                className="w-[200px] border-[0.25px] border-[#ffffff2f] py-6 flex flex-col gap-4 items-center justify-center rounded-2xl cursor-pointer hover:scale-[1.1] transition-all delay-75"
                onClick={() => {
                  selectWallet(wallet.name);
                }}
                key={index}
              >
                <Image
                  src={wallet.logo}
                  width={100}
                  height={100}
                  alt={wallet.name}
                />
                <p className="text-[14px] leading-[24px]">{wallet.name}</p>
              </div>
            ))}
            <div className="p-6 h-[18px]"></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWallet;
