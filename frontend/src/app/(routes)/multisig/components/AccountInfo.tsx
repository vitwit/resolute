import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { deleteMultisig } from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';
import { MultisigAccount } from '@/types/multisig';
import { getLocalDate } from '@/utils/datetime';
import { parseBalance } from '@/utils/denom';
import { formatCoin, formatStakedAmount, shortenAddress } from '@/utils/util';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DailogDeleteMultisig from './DialogDeleteMultisig';

interface AccountInfoProps {
  chainID: string;
  chainName: string;
  address: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinDenom: string;
}

const AccountInfo: React.FC<AccountInfoProps> = (props) => {
  const {
    chainID,
    chainName,
    address,
    coinMinimalDenom,
    coinDecimals,
    coinDenom,
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
          <Image src="/go-back-icon.svg" width={36} height={36} alt="Go Back" />
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
}: {
  multisigAccount: MultisigAccount;
  actionsRequired: number;
  balance: string;
  stakedBalance: string;
  chainName: string;
}) => {
  const { account: accountInfo, pubkeys } = multisigAccount;
  const { address, name, created_at, threshold } = accountInfo;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const deleteMultisigRes = useAppSelector(
    (state: RootState) => state.multisig.deleteMultisigRes
  )

  const router = useRouter();

  const handleGoBack = () => {
    router.push(`/multisig/${chainName}`);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  useEffect(()=>{
    if (deleteMultisigRes?.status === 'idle') {
      handleDeleteDialogClose();
      handleGoBack();
    }
  }, [deleteMultisigRes?.status])

  const handleDelete = () => {
    dispatch(deleteMultisig({
      data: { address: multisigAccount?.account?.address },
      queryParams: { address: '', signature: '' }
    }))
  }

  return (
    <div className="rounded-2xl w-full bg-[#0E0B26] h-full">
      <div className="multisig-info-title">
        <Image
          src="/printed-color.png"
          width={560}
          height={78}
          alt=""
          className="absolute left-[25%] top-0"
        />
        <div className="w-full flex justify-between">
          <h2 className="text-[16px] font-bold">{name}</h2>
          <h3 className="text-[14px] font-bold">{getLocalDate(created_at)}</h3>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <AccountInfoItem
            icon={'/address-icon.svg'}
            name={'Address'}
            value={
              <div className="multisig-account-address">
                <div className="overflow-hidden">
                  {shortenAddress(address, 28)}
                </div>
                <Image src="/copy.svg" width={24} height={24} alt="copy" />
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
            <Image src={'/list-icon.svg'} width={40} height={40} alt={name} />
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
          className="delete-multisig-btn">Delete Multisig</button>
        </div>
      </div>

      <DailogDeleteMultisig
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
        <Image src={icon} width={40} height={40} alt={name} />
        <div>{name}</div>
      </div>
      <div className="px-2 leading-10">{value}</div>
    </div>
  );
};

const MemberAddress = ({ address }: { address: string }) => {
  return (
    <div className="member-address">
      <div className="overflow-hidden">{shortenAddress(address, 28)}</div>
      <Image src="/copy.svg" width={24} height={24} alt="copy" />
    </div>
  );
};
