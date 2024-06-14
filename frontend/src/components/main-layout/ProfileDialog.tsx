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

  const walletUserName = useAppSelector((state) => state.wallet.name);

  useEffect(() => {
    setWalletLogo(getConnectWalletLogo());
  }, []);


  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(resetWallet());
    dispatch(resetError());
    dispatch(resetTxAndHash());
    dispatch(bankReset());
    dispatch(rewardsReset());
    dispatch(stakingReset());
    dispatch(authzReset());
    dispatch(feegrantReset());
    logout();
    onClose();
  }


  return (
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
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-[20px] font-bold leading-[27px]">
                Profile
              </div>
              <div className="secondary-text">
                Profile
              </div>
              <div className="divider-line"></div>
            </div>
            <div className="flex flex-col items-center gap-2 px-6 py-[10px]">
              <Image src={walletLogo} height={40} width={40} alt="" />
              <div className="font-medium">{walletUserName}</div>
            </div>
            <div>
              <button onClick={handleLogout} className="primary-btn w-full">Logout</button>
            </div>
            <button onClick={onClose} className="secondary-btn w-full">
              Close Tab
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
