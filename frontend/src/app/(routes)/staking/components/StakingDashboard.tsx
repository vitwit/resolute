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
  const dispatch = useAppDispatch();
  const staking = useStaking({ isSingleChain: false });
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
    <div className="flex flex-col items-start w-full py-10">
      <div
        className={`flex flex-col w-full ${isWalletConnected ? 'gap-6' : ''}`}
      >
        <div className="items-start">
          <div className="text-h1">Staking</div>
          <div className="space-y-2">
            <div className="secondary-text">
              {!isWalletConnected ? (
                'Connect your wallet now to access all the modules on resolute'
              ) : (
                <p>
                  Here&apos;s an overview of your staked assets, including
                  delegation and undelegation details, and your total staked
                  balance.
                </p>
              )}
            </div>
            <div className="divider-line"></div>
          </div>
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
    </div>
  );
};
export default StakingDashboard;
