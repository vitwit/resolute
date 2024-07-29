'use client';

// import ValidatorTable from './ValidatorTable';
import useStaking from '@/custom-hooks/useStaking';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import EmptyScreen from '@/components/common/EmptyScreen';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import StakingSummary from './StakingSummary';
import StakingUnDelegations from './StakingUnDelegations';
import StakingDelegations from './StakingDelegations';
import { Dialog, DialogContent } from '@mui/material';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { useState } from 'react';
import CustomButton from '@/components/common/CustomButton';

// import { RootState } from '@/store/store';
// import { useAppSelector } from '@/custom-hooks/StateHooks';

const StakingDashboard = () => {
  const dispatch = useAppDispatch();
  const staking = useStaking({ isSingleChain: false });
  const {
    totalStakedAmount,
    rewardsAmount,
    totalUnStakedAmount,
    availableAmount,
  } = staking.getStakingAssets();

  const delegations = staking.getAllDelegations();

  const [newDelegation, setNewDelegation] = useState(false);
  const isWalletConnected = useAppSelector(
    (state: RootState) => state.wallet.connected
  );
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const hasUnbonding = useAppSelector(
    (state: RootState) => state.staking.hasUnbonding
  );
  const hasAuthzUnbonding = useAppSelector(
    (state: RootState) => state.staking.authz.hasUnbonding
  );
  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  return (
    <div className="flex flex-col items-start w-full py-10 min-h-[calc(100vh-64px)]">
      <div
        className={`flex flex-col w-full ${isWalletConnected ? 'gap-6' : ''}`}
      >
        <div className="flex items-end gap-6">
          <div className="flex flex-col gap-1 flex-1">
            <div className="text-h1">Staking</div>
            <div className="flex flex-col gap-2">
              <div className="secondary-text">
                {!isWalletConnected ? (
                  'Connect your wallet now to access all the modules on resolute'
                ) : (
                  <p>
                    Here&apos;s an overview of your staked assets, including
                    delegation and undelegation details
                  </p>
                )}
              </div>
              <div className="divider-line"></div>
            </div>
          </div>
          <CustomButton
            btnText="New Delegation"
            btnOnClick={() => setNewDelegation(true)}
          />
        </div>

        {isWalletConnected ? (
          <>
            {/* Staking summary */}
            <StakingSummary
              availableAmount={availableAmount}
              stakedAmount={totalStakedAmount}
              unstakeAmount={totalUnStakedAmount}
              rewardsAmount={rewardsAmount}
            />

            {/* Delegations */}
            <StakingDelegations
              delegations={delegations}
              isSingleChain={false}
            />

            {/* Unbonding */}
            {(!isAuthzMode && hasUnbonding) ||
            (isAuthzMode && hasAuthzUnbonding) ? (
              <StakingUnDelegations undelegations={delegations} />
            ) : null}
          </>
        ) : (
          <EmptyScreen
            title="Connect your wallet"
            description="Connect your wallet to access your account on Resolute"
            hasActionBtn={true}
            btnText={'Connect Wallet'}
            btnOnClick={connectWalletOpen}
          />
        )}
      </div>
      <NewDelegation
        open={newDelegation}
        onClose={() => {
          setNewDelegation(false);
        }}
      />
    </div>
  );
};
export default StakingDashboard;

const NewDelegation = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      sx={{
        '& .MuiDialog-paper': {
          color: 'white',
        },
      }}
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="p-10 pb-14 space-y-6 w-[450px]">
          <div className="flex justify-end px-6">
            <button onClick={onClose} className="text-btn !h-8">
              Close
            </button>
          </div>
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-2">
              <div className="text-[18px] font-semibold">New Delegation</div>
              <div className="text-[14px] text-[#ffffff80]">
                Please select a network on the left for new delegation.
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
