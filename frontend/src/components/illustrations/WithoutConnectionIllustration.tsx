import { useAppDispatch } from '@/custom-hooks/StateHooks';
import Image from 'next/image';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';

const WithoutConnectionIllustration = () => {
  const dispatch = useAppDispatch();
  const connectWallet = () => {
    dispatch(setConnectWalletOpen(true));
  };

  return (
    <div className="flex flex-col justify-center  gap-10 w-full px-10 py-20 h-[calc(100vh-64px)]">
      {/* <div className="flex flex-col items-start space-y-1">
        <div className="text-h1">Staking</div>
        <div className="text-b1-light">
          Connect your wallet now to access all the modules on resolute{' '}
        </div>
        <div className="divider-line"></div>
      </div> */}
      <div className="flex flex-col justify-center items-center gap-10">
        <div>
          <Image
            src="/dashboard.png"
            width={914}
            height={480}
            alt="Dashboard-Image"
          />
          <div className="flex flex-col justify-center items-center gap-2 w-full">
            <p className="empty-screen-title">Connect your Wallet</p>
            <p className="secondary-text">
              Connect your wallet to access your account on Resolute
            </p>
          </div>
        </div>
        <button onClick={connectWallet} className="primary-btn">
          Connect wallet
        </button>
      </div>
    </div>
  );
};

export default WithoutConnectionIllustration;
