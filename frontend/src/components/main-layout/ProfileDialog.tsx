import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getConnectWalletLogo } from '@/utils/util';
import { Dialog, DialogContent, Slide, SlideProps } from '@mui/material';
import Image from 'next/image';
import React, { forwardRef, useEffect, useState } from 'react';

import { resetWallet } from '@/store/features/wallet/walletSlice';
import { logout } from '@/utils/localStorage';
import {
  resetError,
  resetTxAndHash,
} from '@/store/features/common/commonSlice';
import { resetState as bankReset } from '@/store/features/bank/bankSlice';
import { resetState as rewardsReset } from '@/store/features/distribution/distributionSlice';
import { resetCompleteState as stakingReset } from '@/store/features/staking/stakeSlice';
import { resetState as authzReset } from '@/store/features/authz/authzSlice';
import { resetState as feegrantReset } from '@/store/features/feegrant/feegrantSlice';
import DialogConfirmExitSession from './DialogConfirmExitSession';

/* eslint-disable @typescript-eslint/no-explicit-any */
const Transition = forwardRef(function Transition(
  props: SlideProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<any>
) {
  return <Slide direction="left" ref={ref} {...props} timeout={500} />;
});

const ProfileDialog = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [walletLogo, setWalletLogo] = useState('');
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);

  const walletUserName = useAppSelector((state) => state.wallet.name);

  useEffect(() => {
    setWalletLogo(getConnectWalletLogo());
  }, []);

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    setConfirmExitOpen(true); // Open confirmation dialog instead of logging out directly
  };

  const handleConfirmExitSession = () => {
    dispatch(resetWallet());
    dispatch(resetError());
    dispatch(resetTxAndHash());
    dispatch(bankReset());
    dispatch(rewardsReset());
    dispatch(stakingReset());
    dispatch(authzReset());
    dispatch(feegrantReset());
    logout();
    setConfirmExitOpen(false);
    onClose();
  };

  const handleCancelExitSession = () => {
    setConfirmExitOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth="lg"
        TransitionComponent={Transition}
        sx={{
          '& .MuiDialog-paper': {
            position: 'absolute',
            right: '30px',
            left: 'auto',
            height: 'calc(100% - 60px)',
            margin: 0,
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
          <div className="profile-section">
            <button
              className="absolute top-6 right-6 hover:bg-[#ffffff10] w-8 h-8 rounded-full flex items-center justify-center"
              onClick={onClose}
            >
              <Image src="/close.svg" width={20} height={20} alt="close-icon" />
            </button>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-h2 !font-bold pt-8">Profile</div>
                <div className="text-b1">
                  View your account information here
                </div>
                <div className="divider-line"></div>
              </div>
              <div className="flex flex-col items-center gap-2 px-6 py-[10px]">
                <Image src={walletLogo} height={40} width={40} alt="" />
                <div className="text-b1">{walletUserName}</div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="profile-grid">
                  <p className="text-small-light">Address</p>
                  <div className="flex gap-2 items-center">
                    <p className="text-b1">cosmo8jk80....</p>
                    <Image
                      src="/copy-icon.svg"
                      width={18}
                      height={18}
                      alt="copy-icon"
                    />
                  </div>
                </div>
                <div className="profile-grid">
                  <p className="text-small-light">Sequence</p>

                  <p className="text-b1">cosmo8jk80....</p>
                </div>
              </div>
              <div className="profile-grid w-full">
                <p className="text-small-light">Pubkey</p>
                <div className="flex gap-2 items-center">
                  <p className="text-b1">12jhdu38ndi83w7y39</p>
                  <Image
                    src="/copy-icon.svg"
                    width={18}
                    height={18}
                    alt="copy-icon"
                  />
                </div>
              </div>
              <div>
                <button onClick={handleLogout} className="primary-btn w-full">
                  Logout
                </button>
              </div>
              <button onClick={onClose} className="secondary-btn w-full">
                Close Tab
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DialogConfirmExitSession
        open={confirmExitOpen}
        onClose={handleCancelExitSession}
        onConfirm={handleConfirmExitSession}
      />
    </>
  );
};

export default ProfileDialog;
