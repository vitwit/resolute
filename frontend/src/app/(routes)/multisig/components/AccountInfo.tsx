import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { deleteMultisig } from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';
import { MultisigAccount } from '@/types/multisig';
import { parseBalance } from '@/utils/denom';
import { formatCoin, formatStakedAmount, isMultisigMember } from '@/utils/util';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DialogDeleteMultisig from './DialogDeleteMultisig';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import CommonCopy from '@/components/CommonCopy';
import { getAuthToken } from '@/utils/localStorage';

interface AccountInfoProps {
  chainID: string;
  chainName: string;
  address: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinDenom: string;
  walletAddress: string;
}

const AccountInfo: React.FC<AccountInfoProps> = (props) => {
  const {
    chainID,
    chainName,
    address,
    coinMinimalDenom,
    coinDecimals,
    coinDenom,
    walletAddress,
  } = props;
  const router = useRouter();
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  const handleGoBack = () => {
    router.push(`/multisig/${chainName}`);
  };

  const multisigAccount = useAppSelector(
    (state: RootState) => state.multisig.multisigAccount
  );
  const multisigAccounts = useAppSelector(
    (state: RootState) => state.multisig.multisigAccounts
  );
  const balance = useAppSelector(
    (state: RootState) => state.multisig.balance.balance
  );
  const totalStaked = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.delegations.totalStaked
  );
  const stakedTokens = [
    {
      amount: totalStaked?.toString() || '',
      denom: coinMinimalDenom,
    },
  ];

  const isAdmin =
    multisigAccount?.account?.created_by === (walletAddress || '');

  const { txnCounts = {} } = multisigAccounts;
  const actionsRequired = txnCounts?.[address] || 0;

  useEffect(() => {
    setAvailableBalance(
      parseBalance([balance], coinDecimals, coinMinimalDenom)
    );
  }, [balance]);

  return (
    <div className="multisig-account-info">
      <h2 className="text-[20px] leading-normal font-normal">Multisig</h2>
      <div className="flex-1 flex gap-2 items-center">
        <div className="cursor-pointer" onClick={() => handleGoBack()}>
          <Image
            src="/go-back-icon.svg"
            width={24}
            height={24}
            alt="Go Back"
            draggable={false}
          />
        </div>
        <div className="text-[16px] leading-10 tracking-[0.64px]">
          {multisigAccount.account.name || '-'}
        </div>
      </div>
      <AccountDetails
        chainName={chainName}
        multisigAccount={multisigAccount}
        actionsRequired={actionsRequired}
        balance={formatCoin(availableBalance, coinDenom)}
        stakedBalance={formatStakedAmount(stakedTokens, {
          coinDenom,
          coinMinimalDenom,
          coinDecimals,
        })}
        chainID={chainID}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default AccountInfo;

const AccountDetails = ({
  multisigAccount,
  actionsRequired,
  balance,
  stakedBalance,
  chainName,
  chainID,
  isAdmin,
}: {
  multisigAccount: MultisigAccount;
  actionsRequired: number;
  balance: string;
  stakedBalance: string;
  chainName: string;
  chainID: string;
  isAdmin: boolean;
}) => {
  const { account: accountInfo, pubkeys } = multisigAccount;
  const { address, name, created_at, threshold } = accountInfo;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const deleteMultisigRes = useAppSelector(
    (state: RootState) => state.multisig.deleteMultisigRes
  );

  const router = useRouter();

  const handleGoBack = () => {
    router.push(`/multisig/${chainName}`);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    if (deleteMultisigRes?.status === 'idle') {
      handleDeleteDialogClose();
      handleGoBack();
    }
  }, [deleteMultisigRes?.status]);

  const authToken = getAuthToken(chainID);

  const handleDelete = () => {
    if (isAdmin) {
      dispatch(
        deleteMultisig({
          data: { address: multisigAccount?.account?.address },
          queryParams: {
            address: authToken?.address || '',
            signature: authToken?.signature || '',
          },
        })
      );
    }
  };

  return (
    <div className="flex flex-col rounded-2xl w-full bg-[#0E0B26] h-full">
      <div className="multisig-info-title">
        <div className="w-full flex justify-between">
          <h2 className="text-[16px] font-bold">{name}</h2>
          {created_at ? (
            <h3 className="text-[14px] font-bold">
              Created&nbsp;{getTimeDifferenceToFutureDate(created_at, true)}
              &nbsp;ago
            </h3>
          ) : null}
        </div>
      </div>
      <div className="flex-1 p-6 space-y-6 flex flex-col h-full">
        <div className="grid grid-cols-2 gap-6">
          <AccountInfoItem
            icon={'/address-icon.svg'}
            name={'Address'}
            value={
              <div className="multisig-account-address">
                <MemberAddress address={address} />
              </div>
            }
          />
          <AccountInfoItem
            icon={'/staking-icon.svg'}
            name={'Staked'}
            value={stakedBalance}
          />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <AccountInfoItem
            icon={'/threshold-icon.svg'}
            name={'Threshold'}
            value={threshold}
          />
          <AccountInfoItem
            icon={'/threshold-icon.svg'}
            name={'Actions Required'}
            value={actionsRequired}
          />
          <AccountInfoItem
            icon={'/tokens-icon.svg'}
            name={'Available Tokens'}
            value={balance}
          />
        </div>
        <div className="account-members">
          <div className="flex items-center">
            <Image
              src={'/list-icon.svg'}
              width={40}
              height={40}
              alt={name}
              draggable={false}
            />
            <div>Members</div>
          </div>
          <div className="members-list">
            {pubkeys.map((pubkey, index) => (
              <MemberAddress key={index} address={pubkey.address} />
            ))}
          </div>
        </div>
        <div>
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className={
              isAdmin
                ? 'delete-multisig-btn'
                : 'delete-multisig-btn btn-disabled'
            }
            disabled={!isAdmin}
          >
            Delete Multisig
          </button>
        </div>
      </div>

      <DialogDeleteMultisig
        open={deleteDialogOpen}
        onClose={() => handleDeleteDialogClose()}
        deleteTx={handleDelete}
      />
    </div>
  );
};

const AccountInfoItem = ({
  icon,
  name,
  value,
}: {
  icon: string;
  name: string;
  value: string | number | React.ReactNode;
}) => {
  return (
    <div className="account-info-item">
      <div className="flex items-center">
        <Image src={icon} width={40} height={40} alt={name} draggable={false} />
        <div>{name}</div>
      </div>
      <div className="px-2 leading-10">{value}</div>
    </div>
  );
};

const MemberAddress = ({ address }: { address: string }) => {
  return <CommonCopy message={address} style="text-[14px] justify-center" />;
};
