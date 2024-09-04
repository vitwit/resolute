import { useAppDispatch, useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';
import useGetChainInfo from './useGetChainInfo';
import {
  getValidator,
  txCancelUnbonding,
  txDelegate,
  txReDelegate,
  txRestake,
  txUnDelegate,
} from '@/store/features/staking/stakeSlice';
import {
  txWithdrawAllRewards,
} from '@/store/features/distribution/distributionSlice';
import useGetAssetsAmount from './useGetAssetsAmount';
import useGetTxInputs from './useGetTxInputs';
import useGetFeegranter from './useGetFeegranter';
import { MAP_TXN_MSG_TYPES } from '@/utils/feegrant';
import useGetAuthzAssetsAmount from './useGetAuthzAssetsAmount';
import useAuthzStakingExecHelper from './useAuthzStakingExecHelper';
import { UnbondingEncode } from '@/txns/staking/unbonding';
import { TxStatus } from '@/types/enums';

/* eslint-disable react-hooks/rules-of-hooks */
const useStaking = ({  }: { isSingleChain: boolean }) => {
  const dispatch = useAppDispatch();
  const { getFeegranter } = useGetFeegranter();
  const { txAuthzDelegate, txAuthzReDelegate, txAuthzUnDelegate } =
    useAuthzStakingExecHelper();
  const { txAuthzRestake, txAuthzClaim, txAuthzCancelUnbond } =
    useAuthzStakingExecHelper();

  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.values(nameToChainIDs);

  const {
    getChainInfo,
    getDenomInfo,
  } = useGetChainInfo();

  const rewardsChains = useAppSelector((state: RootState) =>
    isAuthzMode ? state.distribution.authzChains : state.distribution.chains
  );

  const [
    totalStakedAmount,
    availableAmount,
    rewardsAmount,
    totalUnStakedAmount,
  ] = isAuthzMode
      ? useGetAuthzAssetsAmount(chainIDs)
      : useGetAssetsAmount(chainIDs);
      
  const stakeData = useAppSelector((state: RootState) =>
    isAuthzMode ? state.staking.authz.chains : state.staking.chains
  );

  const delegationsLoading = useAppSelector((state: RootState) =>
    isAuthzMode
      ? state.staking.authz.delegationsLoading
      : state.staking.delegationsLoading
  );

  const undelegationsLoading = useAppSelector((state: RootState) =>
    isAuthzMode
      ? state.staking.authz.undelegationsLoading
      : state.staking.undelegationsLoading
  );

  const cancelUnbdongTxLoading = (chainID: string) => {
    return stakeData[chainID].cancelUnbondingTxStatus === TxStatus.PENDING ? true : false;
  }

  const totalUnbondedAmount = useAppSelector((state: RootState) =>
    isAuthzMode
      ? state.staking.authz.totalUndelegationsAmount
      : state.staking.totalUndelegationsAmount
  );

  const {
    txWithdrawAllRewardsInputs,
    txWithdrawValidatorRewardsInputs,
    txRestakeInputs,
    txAuthzRestakeMsgs,
  } = useGetTxInputs();

  const fetchValidatorDetails = (valoperAddress: string, chainID: string) => {
    const { restURLs } = getChainInfo(chainID);
    dispatch(
      getValidator({
        baseURLs: restURLs,
        chainID,
        valoperAddress: valoperAddress,
      })
    );
  };

  const chainLogo = (chainID: string) =>
    networks[chainID]?.network?.logos?.menu || '';
  const chainName = (chainID: string) => {
    const { chainName } = getChainInfo(chainID);
    return chainName;
  };

  const getStakingAssets = () => {
    return {
      totalStakedAmount,
      rewardsAmount,
      totalUnStakedAmount,
      availableAmount,
    };
  };

  const getAllDelegations = () => {
    return stakeData;
  };

  // Get total staked amount of chain

  const getAmountWithDecimal = (amount: number, chainID: string) => {
    const { decimals, displayDenom } = getDenomInfo(chainID);
    return (amount / 10 ** decimals).toFixed(6) + ' ' + displayDenom;
  };

  const getAmountObjectWithDecimal = (amount: number, chainID: string) => {
    const { decimals, displayDenom } = getDenomInfo(chainID);
    return {
      amount: (amount / 10 ** decimals).toFixed(6),
      denom: displayDenom,
    };
  };

  const chainTotalRewards = (chainID: string) => {
    let totalRewardsAmount = 0;
    let displayDenomName = '';
    chainIDs.forEach((cId) => {
      if (cId === chainID) {
        const rewards =
          rewardsChains?.[chainID]?.delegatorRewards?.totalRewards || 0;

        const { decimals, displayDenom } = getDenomInfo(chainID);
        if (rewards > 0) {
          totalRewardsAmount += rewards / 10 ** decimals;
        }

        displayDenomName = displayDenom;

        return false;
      }
    });

    return totalRewardsAmount.toFixed(4) + ' ' + displayDenomName;
  };

  const chainTotalValRewards = (validator: string, chainID: string) => {
    let totalRewardsAmount = 0;
    let displayDenomName = '';

    chainIDs.forEach((cId) => {
      if (cId === chainID) {
        const rewards = rewardsChains?.[chainID]?.delegatorRewards;
        rewards?.list?.forEach((r) => {
          if (r.validator_address === validator) {
            const { decimals, displayDenom, minimalDenom } =
              getDenomInfo(chainID);
            r?.reward?.forEach((r1) => {
              if (r1?.denom === minimalDenom) {
                totalRewardsAmount = Number(r1?.amount || 0) / 10 ** decimals;
                displayDenomName = displayDenom;
              }
            });
          }

          return false;
        });

        return false;
      }
    });

    return totalRewardsAmount.toFixed(4) + ' ' + displayDenomName;
  };

  // tx: withdraw claim rewards without authz and fee grant

  const txWithdrawCliamRewards = (chainID: string) => {
    const txInputs = txWithdrawAllRewardsInputs(chainID);
    txInputs.isTxAll = true;
    if (txInputs.msgs.length) dispatch(txWithdrawAllRewards(txInputs));
  };

  const transactionRestake = (chainID: string) => {
    if (isAuthzMode) {
      const { address } = getChainInfo(chainID);
      const msgs = txAuthzRestakeMsgs(chainID);
      txAuthzRestake({
        grantee: address,
        granter: authzAddress,
        msgs: msgs,
        chainID: chainID,
        isTxAll: true,
      });
      return;
    }
    const txInputs = txRestakeInputs(chainID);
    txInputs.isTxAll = true;
    if (txInputs.msgs.length) dispatch(txRestake(txInputs));
  };

  const txWithdrawValRewards = (validator: string, chainID: string) => {
    const { address } = getChainInfo(chainID);
    if (isAuthzMode) {
      txAuthzClaim({
        grantee: address,
        granter: authzAddress,
        pairs: [{ validator, delegator: authzAddress }],
        chainID: chainID,
      });
      return;
    }
    const delegatorAddress = networks[chainID]?.walletInfo?.bech32Address;
    const txInputs = txWithdrawValidatorRewardsInputs(
      chainID,
      validator,
      delegatorAddress
    );
    txInputs.isTxAll = false;
    if (txInputs.msgs.length) dispatch(txWithdrawAllRewards(txInputs));
  };

  const txAllChainTxStatus = useAppSelector(
    (state: RootState) => state.distribution.chains
  );

  const txAllChainStakeTxStatus = useAppSelector(
    (state: RootState) => state.staking.chains
  );

  const getClaimTxStatus = () => {
    return txAllChainTxStatus;
  };

  const txCancelUnbond = (
    chainID: string,
    delegator: string,
    validator: string,
    amount: number,
    creationHeight: string
  ) => {
    const basicChainInfo = getChainInfo(chainID);
    const { currencies } = networks[chainID]?.network?.config;

    const currency = currencies[0];

    const { feeAmount: avgFeeAmount, address } = getChainInfo(chainID);
    const feeAmount = avgFeeAmount * 10 ** currency?.coinDecimals;

    if (isAuthzMode) {
      const msg = UnbondingEncode(
        delegator,
        validator,
        amount * 10 ** currency.coinDecimals,
        currency.coinMinimalDenom,
        creationHeight
      );
      txAuthzCancelUnbond({
        grantee: address,
        granter: authzAddress,
        chainID: chainID,
        msg: msg,
      });
    } else {
      dispatch(
        txCancelUnbonding({
          isAuthzMode: false,
          basicChainInfo: basicChainInfo,
          delegator: delegator,
          validator: validator,
          amount: amount * 10 ** currency?.coinDecimals,
          denom: currency?.coinMinimalDenom,
          feeAmount: feeAmount,
          feegranter: getFeegranter(
            chainID,
            MAP_TXN_MSG_TYPES['cancel_unbonding']
          ),
          creationHeight: creationHeight,
        })
      );
    }
  };

  const txDelegateTx = (validator: string, amount: number, chainID: string) => {
    const basicChainInfo = getChainInfo(chainID);
    const { currencies } = networks[chainID]?.network?.config;

    const currency = currencies[0];

    const { feeAmount: avgFeeAmount, address } = getChainInfo(chainID);
    const feeAmount = avgFeeAmount * 10 ** currency?.coinDecimals;

    const txDelegateInputs = {
      validator: validator,
      amount: amount * 10 ** currency?.coinDecimals,
      denom: currency?.coinMinimalDenom,
    };

    if (isAuthzMode) {
      txAuthzDelegate({
        ...txDelegateInputs,
        grantee: address,
        granter: authzAddress,
        chainID: basicChainInfo.chainID,
      });
    } else {
      dispatch(
        txDelegate({
          ...txDelegateInputs,
          isAuthzMode: false,
          basicChainInfo: basicChainInfo,
          delegator: basicChainInfo.address,
          feeAmount: feeAmount,
          feegranter: getFeegranter(chainID, MAP_TXN_MSG_TYPES['delegate']),
        })
      );
    }
  };

  const txUnDelegateTx = (
    validator: string,
    amount: number,
    chainID: string
  ) => {
    const basicChainInfo = getChainInfo(chainID);
    const { currencies } = networks[chainID]?.network?.config;

    const currency = currencies[0];

    const { feeAmount: avgFeeAmount, address } = getChainInfo(chainID);
    const feeAmount = avgFeeAmount * 10 ** currency?.coinDecimals;

    const txUndelegateInputs = {
      validator: validator,
      amount: amount * 10 ** currency?.coinDecimals,
      denom: currency?.coinMinimalDenom,
    };
    if (isAuthzMode) {
      txAuthzUnDelegate({
        ...txUndelegateInputs,
        grantee: address,
        granter: authzAddress,
        chainID: basicChainInfo.chainID,
      });
    } else {
      dispatch(
        txUnDelegate({
          ...txUndelegateInputs,
          isAuthzMode: false,
          basicChainInfo: basicChainInfo,
          delegator: basicChainInfo.address,

          feeAmount: feeAmount,
          feegranter: getFeegranter(chainID, MAP_TXN_MSG_TYPES['undelegate']),
        })
      );
    }
  };

  const txReDelegateTx = (
    srcVal: string,
    destVal: string,
    amount: number,
    chainID: string
  ) => {
    const basicChainInfo = getChainInfo(chainID);
    const { currencies } = networks[chainID]?.network?.config;

    const currency = currencies[0];

    const { feeAmount: avgFeeAmount, address } = getChainInfo(chainID);
    const feeAmount = avgFeeAmount * 10 ** currency?.coinDecimals;

    if (isAuthzMode) {
      txAuthzReDelegate({
        grantee: address,
        granter: authzAddress,
        srcValidator: srcVal,
        validator: destVal,
        amount: amount * 10 ** currency.coinDecimals,
        denom: currency.coinMinimalDenom,
        chainID: basicChainInfo.chainID,
      });
    } else {
      dispatch(
        txReDelegate({
          isAuthzMode: false,
          basicChainInfo: basicChainInfo,
          delegator: basicChainInfo.address,
          destVal: destVal,
          srcVal: srcVal,
          amount: amount * 10 ** currency?.coinDecimals,
          denom: currency?.coinMinimalDenom,
          feeAmount: feeAmount,
          feegranter: getFeegranter(chainID, MAP_TXN_MSG_TYPES['redelegate']),
        })
      );
    }
  };

  return {
    getStakingAssets,
    getAllDelegations,
    fetchValidatorDetails,
    getAmountWithDecimal,
    chainTotalRewards,
    chainLogo,
    txWithdrawCliamRewards,
    getClaimTxStatus,
    txCancelUnbond,
    txDelegateTx,
    txAllChainStakeTxStatus,
    txUnDelegateTx,
    txReDelegateTx,
    txWithdrawValRewards,
    chainTotalValRewards,
    delegationsLoading,
    undelegationsLoading,
    totalUnbondedAmount,
    transactionRestake,
    chainName,
    getAmountObjectWithDecimal,
    cancelUnbdongTxLoading,
  };
};

export default useStaking;
