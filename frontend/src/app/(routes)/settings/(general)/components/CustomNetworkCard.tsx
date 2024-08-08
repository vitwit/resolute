import DialogConfirmDeleteNetwork from '@/components/select-network/DialogConfirmDeleteNetwork';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { establishWalletConnection } from '@/store/features/wallet/walletSlice';
import { networks } from '@/utils/chainsInfo';
import { getLocalNetworks, removeLocalNetwork } from '@/utils/localStorage';
import { shortenName } from '@/utils/util';
import Image from 'next/image';
import React, { useState } from 'react';

const CustomNetworkCard = ({
  chainID,
  chainLogo,
  chainName,
}: {
  chainID: string;
  chainName: string;
  chainLogo: string;
}) => {
  const dispatch = useAppDispatch();
  const [removeNetworkDialogOpen, setRemoveNetworkDialogOpen] = useState(false);

  const handleRemoveNetwork = async () => {
    await removeLocalNetwork(chainID);
    dispatch(
      establishWalletConnection({
        walletName: 'keplr',
        networks: [...networks, ...getLocalNetworks()],
      })
    );
    setRemoveNetworkDialogOpen(false);
    dispatch(setError({ type: 'succes', message: 'Network Removed' }));
  };

  return (
    <div className="customnetwork-card">
      <div className="flex justify-between w-full">
        <div className="flex gap-1 items-center">
          <Image
            src={chainLogo}
            width={24}
            height={24}
            alt={`${chainName} logo`}
            className="w-6 h-6"
          />
          <p className="text-b1 capitalize">{chainName}</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setRemoveNetworkDialogOpen(true)}
        >
          Remove
        </button>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-2">
          <p className="text-small-light">Network</p>
          <p className="text-b1 capitalize">{shortenName(chainName, 15)}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-small-light">Chain ID</p>
          <p className="text-b1">{chainID}</p>
        </div>
      </div>
      <DialogConfirmDeleteNetwork
        open={removeNetworkDialogOpen}
        onClose={() => setRemoveNetworkDialogOpen(false)}
        onConfirm={handleRemoveNetwork}
      />
    </div>
  );
};

export default CustomNetworkCard;
