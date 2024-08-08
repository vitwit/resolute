import { useAppDispatch } from '@/custom-hooks/StateHooks';
import {
  setChangeNetworkDialogOpen,
  setError,
  setSelectedNetwork,
} from '@/store/features/common/commonSlice';
import { Avatar, Badge, IconButton, Tooltip } from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { establishWalletConnection } from '@/store/features/wallet/walletSlice';
import { networks } from '@/utils/chainsInfo';
import { getLocalNetworks, removeLocalNetwork } from '@/utils/localStorage';
import { useRouter } from 'next/navigation';
import DialogConfirmDeleteNetwork from './DialogConfirmDeleteNetwork';

const NetworkItem = ({
  chainName,
  chainLogo,
  pathName,
  handleClose,
  selected,
  isDefaultNetwork,
  chainID,
}: {
  chainName: string;
  chainLogo: string;
  pathName: string;
  handleClose: () => void;
  selected: boolean;
  isDefaultNetwork?: boolean;
  chainID: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

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
    dispatch(setChangeNetworkDialogOpen({ open: false, showSearch: true }));
    dispatch(setError({ type: 'success', message: 'Network Removed' }));
    setTimeout(() => router.push('/'), 2000);
  };

  return (
    <Badge
      badgeContent={
        !isDefaultNetwork ? (
          <Tooltip title="Remove Network">
            <IconButton
              onClick={() => setRemoveNetworkDialogOpen(true)}
              color="primary"
              size="small"
            >
              <CancelIcon sx={{ color: '#ff5959', fontSize: '20px' }} />
            </IconButton>
          </Tooltip>
        ) : null
      }
      overlap="rectangular"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Link
        href={pathName}
        className={`network-item w-full ${selected ? 'bg-[#FFFFFF14] !border-transparent' : ''}`}
        onClick={() => {
          dispatch(setSelectedNetwork({ chainName: chainName.toLowerCase() }));
          handleClose();
        }}
      >
        <div className="p-1">
          <Avatar src={chainLogo} sx={{ width: 24, height: 24 }} />
        </div>
        <h3 className="network-name">{chainName}</h3>
      </Link>
      <DialogConfirmDeleteNetwork
        open={removeNetworkDialogOpen}
        onClose={() => setRemoveNetworkDialogOpen(false)}
        onConfirm={handleRemoveNetwork}
      />
    </Badge>
  );
};

export default NetworkItem;
