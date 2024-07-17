import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  getMultisigAccounts,
  getMultisigBalance,
  multisigByAddress,
  resetBroadcastTxnRes,
  resetCreateTxnState,
  resetsignTransactionRes,
  resetUpdateTxnState,
  setVerifyDialogOpen,
} from '@/store/features/multisig/multisigSlice';
import {
  getAllValidators,
  getDelegations,
} from '@/store/features/staking/stakeSlice';
import { useEffect, useState } from 'react';
import MultisigAccountHeader from './MultisigAccountHeader';
import Copy from '@/components/common/Copy';
import { formatStakedAmount } from '@/utils/util';
import { parseBalance } from '@/utils/denom';
import Transactions from './Transactions';
import Loader from '../common/Loader';
import Link from 'next/link';
import { TxStatus } from '@/types/enums';
import DialogVerifyAccount from '../common/DialogVerifyAccount';
import MultisigInfoLoading from '../loaders/MultisigInfoLoading';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import { useRouter } from 'next/navigation';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';

const MultisigAccount = ({
  chainName,
  multisigAddress,
}: {
  chainName: string;
  multisigAddress: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);

  const chainID = nameToChainIDs[chainName];

  const multigAccountRes = useAppSelector(
    (state) => state.multisig.multisigAccount.status
  );

  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { address: walletAddress, baseURL, restURLs } = getChainInfo(chainID);
  const {
    minimalDenom: coinMinimalDenom,
    decimals: coinDecimals,
    displayDenom: coinDenom,
  } = getDenomInfo(chainID);
  const currency = {
    coinMinimalDenom,
    coinDecimals,
    coinDenom,
  };
  const { isAccountVerified } = useVerifyAccount({
    address: walletAddress,
  });

  const [selectedTab, setSelectedTab] = useState('Transactions');

  const multisigAccount = useAppSelector(
    (state) => state.multisig.multisigAccount
  );
  const members = multisigAccount.pubkeys.map((pubkey) => pubkey.address);

  const { name: multisigName, created_at: createdTime } =
    multisigAccount.account;

  const isAdmin =
    multisigAccount?.account?.created_by === (walletAddress || '');

  const handleChange = (tab: string) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    if (chainID) {
      dispatch(
        getMultisigBalance({
          baseURL,
          address: multisigAddress,
          denom: coinMinimalDenom,
          baseURLs: restURLs,
          chainID,
        })
      );
      dispatch(
        getDelegations({
          baseURLs: restURLs,
          address: multisigAddress,
          chainID,
        })
      );
      dispatch(getAllValidators({ baseURLs: restURLs, chainID }));
      dispatch(multisigByAddress({ address: multisigAddress }));
      dispatch(getMultisigAccounts(walletAddress));
    }
  }, [chainID]);

  useEffect(() => {
    dispatch(resetCreateTxnState());
    dispatch(resetUpdateTxnState());
    dispatch(resetBroadcastTxnRes());
    dispatch(resetsignTransactionRes());
  }, []);

  const createNewTxn = () => {
    if (!isAccountVerified()) {
      dispatch(setVerifyDialogOpen(true));
      return;
    }
    router.push(`/multisig/${chainName}/${multisigAddress}/create-txn`);
  };

  return (
    <div>
      {multigAccountRes === TxStatus.PENDING ? (
        <div>
          <MultisigInfoLoading />
        </div>
      ) : (
        <div className="space-y-10">
          <div className="space-y-6">
            <Link
              href={`/multisig/${chainName}`}
              className="text-btn h-8 flex items-center w-fit"
            >
              <span>Back to List</span>
            </Link>
            <MultisigAccountHeader
              isAdmin={isAdmin}
              multisigName={multisigName}
              multisigAddress={multisigAddress}
              walletAddress={walletAddress}
              chainName={chainName}
              threshold={multisigAccount.account.threshold}
              membersCount={multisigAccount.pubkeys?.length || 0}
            />
          </div>
          <div className="space-y-10">
            <MultisigAccountInfo
              chainID={chainID}
              coinMinimalDenom={coinMinimalDenom}
              currency={currency}
              createdTime={createdTime}
            />
            <div className="space-y-6">
              <TabsGroup
                handleChange={handleChange}
                selectedTab={selectedTab}
                tabs={['Transactions', 'Members']}
                createNewTxn={createNewTxn}
              />
              <div className="px-6">
                {selectedTab === 'Transactions' ? (
                  <Transactions
                    chainID={chainID}
                    multisigAddress={multisigAccount.account.address}
                    currency={currency}
                    threshold={multisigAccount.account.threshold}
                  />
                ) : (
                  <MultisigMembersList members={members} />
                )}
              </div>
            </div>
          </div>
          <DialogVerifyAccount walletAddress={walletAddress} />
          <Loader />
        </div>
      )}
    </div>
  );
};

export default MultisigAccount;

const MultisigAccountInfo = ({
  chainID,
  coinMinimalDenom,
  currency,
  createdTime,
}: {
  chainID: string;
  coinMinimalDenom: string;
  currency: Currency;
  createdTime: string;
}) => {
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  const multisigAccount = useAppSelector(
    (state) => state.multisig.multisigAccount
  );
  const multisigAccounts = useAppSelector(
    (state) => state.multisig.multisigAccounts
  );
  const totalStaked = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.delegations.totalStaked
  );
  const balance = useAppSelector((state) => state.multisig.balance.balance);

  const stakedTokens = [
    {
      amount: totalStaked?.toString() || '',
      denom: coinMinimalDenom,
    },
  ];
  const { txnCounts = {} } = multisigAccounts;
  const actionsRequired = txnCounts?.[multisigAccount?.account?.address] || 0;

  useEffect(() => {
    setAvailableBalance(
      parseBalance([balance], currency.coinDecimals, currency.coinMinimalDenom)
    );
  }, [balance]);

  return (
    <div className="space-y-2 px-6">
      <MultisigAccountStats
        actionsRequired={actionsRequired}
        created={getTimeDifferenceToFutureDate(createdTime, true) || '-'}
        stakedBalance={formatStakedAmount(stakedTokens, currency)}
        availableBalance={`${availableBalance} ${currency.coinDenom}`}
      />
    </div>
  );
};

const MultisigAccountStats = ({
  actionsRequired,
  created,
  stakedBalance,
  availableBalance,
}: {
  actionsRequired: number;
  created: string;
  stakedBalance: string;
  availableBalance: string;
}) => {
  const stats = [
    {
      name: 'Staked Balance',
      value: stakedBalance,
    },
    {
      name: 'Available Balance',
      value: availableBalance,
    },
    {
      name: 'Actions Required',
      value: actionsRequired,
    },
    {
      name: 'Created',
      value: created + ' ago',
    },
  ];
  return (
    <div className="flex gap-4 flex-wrap">
      {stats.map((stat) => (
        <MultisigAccountStatsCard
          key={stat.name}
          name={stat.name}
          value={stat.value}
        />
      ))}
    </div>
  );
};

const MultisigAccountStatsCard = ({
  name,
  value,
}: {
  name: string;
  value: string | number;
}) => {
  return (
    <div className="stats-card">
      <div className="text-[12px] font-light text-[#ffffff80] leading-[18px]">
        {name}
      </div>
      <div className="text-[18px] text-[#ffffffad] font-bold">{value}</div>
    </div>
  );
};

const MultisigMembersList = ({ members }: { members: string[] }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {members.map((address, index) => (
        <MultisigMember key={address} address={address} index={index + 1} />
      ))}
    </div>
  );
};

const MultisigMember = ({
  address,
  index,
}: {
  address: string;
  index: number;
}) => {
  return (
    <div className="p-6 space-y-2 rounded-2xl bg-[#ffffff04]">
      <div className="text-[12px] text-[#ffffff80]">Member #{index}</div>
      <div className="flex items-center gap-2">
        <div className="text-[14px] text-[#ffffffad]">{address}</div>
        <Copy content={address} height={20} width={20} />
      </div>
    </div>
  );
};

const TabsGroup = ({
  handleChange,
  selectedTab,
  tabs,
  createNewTxn,
}: {
  tabs: string[];
  handleChange: (tab: string) => void;
  selectedTab: string;
  createNewTxn: () => void;
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-10 items-center flex-1 border-b-[1px] border-[#ffffff1d]">
        {tabs.map((tab) => (
          <div key={tab} className="flex flex-col justify-center">
            <button
              className={`text-[18px] mb-2 px-1 ${
                tab === selectedTab ? 'text-[#ffffffad]' : 'text-[#ffffff80]'
              }`}
              onClick={() => handleChange(tab)}
            >
              {tab}
            </button>
            <div
              className={`h-1 w-full rounded-full ${tab === selectedTab ? 'selected-tab' : ''}`}
            ></div>
          </div>
        ))}
      </div>
      <button className="primary-btn" onClick={createNewTxn}>
        Create Transaction
      </button>
    </div>
  );
};
