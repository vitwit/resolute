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
// import { RootState } from '@/store/store';
// import { useAppSelector } from '@/custom-hooks/StateHooks';

const StakingDashboard = () => {
  const staking = useStaking();
  const {
    totalStakedAmount,
    rewardsAmount,
    totalUnStakedAmount,
    availableAmount,
  } = staking.getStakingAssets();

  const delegations = staking.getAllDelegations();

  const isWalletConnected = useAppSelector(
    (state: RootState) => state.wallet.connected
  );
  const dispatch = useAppDispatch();
  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  return (
    <div className="flex flex-col items-start gap-20 w-full px-10 py-20">
      <div
        className={`flex flex-col w-full ${isWalletConnected ? ' gap-10' : ''}`}
      >
        <div className="space-y-2 items-start">
          <div className="text-h1">Staking</div>
          <div className="secondary-text">
            {isWalletConnected ? (
              'Connect your wallet now to access all the modules on resolute'
            ) : (
              <p>
                Here’s an overview of your staked assets, including delegation
                and undelegation details, and your total staked balance.
              </p>
            )}
          </div>
          <div className="horizontal-line"></div>
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
            {/* Unbonding */}
            <StakingUnDelegations undelegations={delegations} />

            {/* Delegations */}
            <StakingDelegations delegations={delegations} />
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
    </div>
  );
};
export default StakingDashboard;
