import React from 'react';
import SettingsHeader from './components/SettingsHeader';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import EmptyScreen from '@/components/common/EmptyScreen';

interface SetttingLayoutProps {
  action: () => void;
  actionName: string;
  tabName: string;
  children: React.ReactNode;
}

const SettingsLayout = (props: SetttingLayoutProps) => {
  const { action, actionName, tabName, children } = props;
  const dispatch = useAppDispatch();
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const connectWallet = () => {
    dispatch(setConnectWalletOpen(true));
  };

  return (
    <div className="mt-10 space-y-10">
      <SettingsHeader
        action={action}
        actionName={actionName}
        tabName={tabName}
      />
      {isWalletConnected ? (
        <div>{children}</div>
      ) : (
        <div className="pt-10">
          <EmptyScreen
            title="Connect your wallet"
            description="Connect your wallet to access your account on Resolute"
            hasActionBtn={true}
            btnText={'Connect Wallet'}
            btnOnClick={connectWallet}
          />
        </div>
      )}
    </div>
  );
};

export default SettingsLayout;
