import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  getMultisigAccounts,
  getMultisigBalance,
  multisigByAddress,
  resetCreateTxnState,
} from '@/store/features/multisig/multisigSlice';
import {
  getAllValidators,
  getDelegations,
} from '@/store/features/staking/stakeSlice';
import { useEffect, useState } from 'react';
import MultisigAccountHeader from './MultisigAccountHeader';
import Copy from '@/components/common/Copy';
import { formatStakedAmount, shortenAddress } from '@/utils/util';
import { parseBalance } from '@/utils/denom';
import Transactions from './Transactions';
import DialogVerifyAccount from '../DialogVerifyAccount';
import Loader from '../common/Loader';

const MultisigAccount = ({
  chainName,
  multisigAddress,
}: {
  chainName: string;
  multisigAddress: string;
}) => {
  const dispatch = useAppDispatch();

  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);

  const chainID = nameToChainIDs[chainName];

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

  const multisigAccount = useAppSelector(
    (state) => state.multisig.multisigAccount
  );

  const { name: multisigName, created_at: createdTime } =
    multisigAccount.account;

  const isAdmin =
    multisigAccount?.account?.created_by === (walletAddress || '');

  useEffect(() => {
    if (chainID) {
      dispatch(
        getMultisigBalance({
          baseURL,
          address: multisigAddress,
          denom: coinMinimalDenom,
          baseURLs: restURLs,
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
  }, []);

  return (
    <div className="space-y-10">
      <MultisigAccountHeader
        isAdmin={isAdmin}
        multisigName={multisigName}
        createdTime={createdTime}
        goBackURL={`/multisig/${chainName}`}
        multisigAddress={multisigAddress}
        walletAddress={walletAddress}
        chainName={chainName}
      />
      <div className="space-y-20">
        <MultisigAccountInfo
          chainID={chainID}
          coinMinimalDenom={coinMinimalDenom}
          currency={currency}
        />
        <Transactions
          chainID={chainID}
          multisigAddress={multisigAccount.account.address}
          currency={currency}
          threshold={multisigAccount.account.threshold}
          chainName={chainName}
          walletAddress={walletAddress}
        />
      </div>
      <DialogVerifyAccount walletAddress={walletAddress} />
      <Loader />
    </div>
  );
};

export default MultisigAccount;

const MultisigAccountInfo = ({
  chainID,
  coinMinimalDenom,
  currency,
}: {
  chainID: string;
  coinMinimalDenom: string;
  currency: Currency;
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
  const members = multisigAccount.pubkeys.map((pubkey) => pubkey.address);

  useEffect(() => {
    setAvailableBalance(
      parseBalance([balance], currency.coinDecimals, currency.coinMinimalDenom)
    );
  }, [balance]);

  return (
    <div className="space-y-2">
      <MultisigAccountStats
        actionsRequired={actionsRequired}
        threshold={multisigAccount.account.threshold}
        stakedBalance={formatStakedAmount(stakedTokens, currency)}
        availableBalance={`${availableBalance} ${currency.coinDenom}`}
      />
      <MultisigMembersList members={members} />
    </div>
  );
};

const MultisigAccountStats = ({
  actionsRequired,
  threshold,
  stakedBalance,
  availableBalance,
}: {
  actionsRequired: number;
  threshold: number;
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
      name: 'Threshold',
      value: threshold,
    },
  ];
  return (
    <div className="flex gap-2">
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
      <div className="text-[20px] font-bold">{value}</div>
      <div className="text-small-light">{name}</div>
    </div>
  );
};

const MultisigMembersList = ({ members }: { members: string[] }) => {
  return (
    <div className="members-list">
      <div className="text-small-light">Members</div>
      <div className="flex items-end gap-6 flex-wrap">
        {members.map((address) => (
          <MultisigMember key={address} address={address} />
        ))}
      </div>
    </div>
  );
};

const MultisigMember = ({ address }: { address: string }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="text-[20px] font-bold">{shortenAddress(address, 10)}</div>
      <Copy content="address" height={24} width={24} />
    </div>
  );
};
