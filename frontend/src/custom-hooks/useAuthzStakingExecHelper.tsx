import useAddressConverter from './useAddressConverter';
import { useAppDispatch, useAppSelector } from './StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import useGetChainInfo from './useGetChainInfo';
import { capitalizeFirstLetter } from '@/utils/util';
import {
  AuthzExecDelegateMsg,
  AuthzExecMsgCancelUnbond,
  AuthzExecMsgRestake,
  AuthzExecReDelegateMsg,
  AuthzExecUnDelegateMsg,
  AuthzExecWithdrawRewardsMsg,
} from '@/txns/authz/exec';
import { msgDelegate } from '@/txns/staking/delegate';
import { msgReDelegate } from '@/txns/staking/redelegate';
import { DelegationsPairs } from '@/types/distribution';
import { msgUnbonding } from '@/txns/staking/unbonding';
import { msgUnDelegate } from '@/txns/staking/undelegate';
import { txWithdrawAllRewards } from '@/store/features/distribution/distributionSlice';
import {
  txCancelUnbonding,
  txDelegate,
  txReDelegate,
  txRestake,
  txUnDelegate,
} from '@/store/features/staking/stakeSlice';
import { isTimeExpired } from '@/utils/datetime';

export interface AuthzExecHelpDelegate {
  grantee: string;
  granter: string;
  validator: string;
  amount: number;
  denom: string;
  chainID: string;
}

export interface AuthzExecHelpReDelegate {
  grantee: string;
  granter: string;
  srcValidator: string;
  validator: string;
  amount: number;
  denom: string;
  chainID: string;
}

export interface AuthzExecHelpWithdrawRewards {
  grantee: string;
  granter: string;
  pairs: DelegationsPairs[];
  chainID: string;
  isTxAll?: boolean;
}

export interface AuthzExecHelpCancelUnbond {
  grantee: string;
  granter: string;
  msg: Msg;
  chainID: string;
}

export interface AuthzExecHelpRestake {
  grantee: string;
  granter: string;
  msgs: Msg[];
  chainID: string;
  isTxAll?: boolean;
}

export const AUTHZ_VOTE_MSG = '/cosmos.gov.v1beta1.MsgVote';
export const AUTHZ_DEPOSIT_MSG = '/cosmos.gov.v1beta1.MsgDeposit';
const AUTHZ_WITHDRAW_MSG =
  '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward';

const useAuthzStakingExecHelper = () => {
  const { convertAddress } = useAddressConverter();
  const dispatch = useAppDispatch();
  const authzChains = useAppSelector((state) => state.authz.chains);
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const txAuthzDelegate = (data: AuthzExecHelpDelegate) => {
    const basicChainInfo = getChainInfo(data.chainID);
    const address = convertAddress(data.chainID, data.granter);
    const grants: Authorization[] =
      authzChains?.[data.chainID]?.GrantsToMeAddressMapping?.[address] || [];
    let isExpired = false;
    const haveGrant = grants.some((grant) => {
      if (
        (grant.authorization['@type'] ===
          '/cosmos.authz.v1beta1.GenericAuthorization' &&
          grant.authorization.msg === msgDelegate) ||
        (grant.authorization['@type'] ===
          '/cosmos.staking.v1beta1.StakeAuthorization' &&
          grant.authorization.authorization_type ===
            'AUTHORIZATION_TYPE_DELEGATE')
      ) {
        isExpired = isTimeExpired(grant.expiration);
        return true;
      } else {
        return false;
      }
    });
    if (isExpired) {
      dispatch(
        setError({
          type: 'error',
          message: `Your Delegate permission on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account is expired`,
        })
      );
      return;
    }
    if (!haveGrant) {
      dispatch(
        setError({
          type: 'error',
          message: `You don't have permission to Delegate on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account`,
        })
      );
    } else {
      const { minimalDenom } = getDenomInfo(data.chainID);
      const msg = AuthzExecDelegateMsg(
        data.grantee,
        address,
        data.validator,
        data.amount,
        data.denom
      );
      dispatch(
        txDelegate({
          isAuthzMode: true,
          basicChainInfo,
          msgs: [msg],
          memo: '',
          denom: minimalDenom,
          authzChainGranter: address,
        })
      );
    }
  };

  const txAuthzUnDelegate = (data: AuthzExecHelpDelegate) => {
    const basicChainInfo = getChainInfo(data.chainID);
    const address = convertAddress(data.chainID, data.granter);
    const grants: Authorization[] =
      authzChains?.[data.chainID]?.GrantsToMeAddressMapping?.[address] || [];
    let isExpired = false;
    const haveGrant = grants.some((grant) => {
      if (
        (grant.authorization['@type'] ===
          '/cosmos.authz.v1beta1.GenericAuthorization' &&
          grant.authorization.msg === msgUnDelegate) ||
        (grant.authorization['@type'] ===
          '/cosmos.staking.v1beta1.StakeAuthorization' &&
          grant.authorization.authorization_type ===
            'AUTHORIZATION_TYPE_UNDELEGATE')
      ) {
        isExpired = isTimeExpired(grant.expiration);
        return true;
      } else return false;
    });
    if (isExpired) {
      dispatch(
        setError({
          type: 'error',
          message: `Your Un-delegate permission on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account is expired`,
        })
      );
    }
    if (!haveGrant) {
      dispatch(
        setError({
          type: 'error',
          message: `You don't have permission to Un-Delegate on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account`,
        })
      );
    } else {
      const { minimalDenom } = getDenomInfo(data.chainID);
      const msg = AuthzExecUnDelegateMsg(
        data.grantee,
        address,
        data.validator,
        data.amount,
        data.denom
      );
      dispatch(
        txUnDelegate({
          isAuthzMode: true,
          basicChainInfo,
          msgs: [msg],
          memo: '',
          denom: minimalDenom,
          authzChainGranter: address,
        })
      );
    }
  };

  const txAuthzReDelegate = (data: AuthzExecHelpReDelegate) => {
    const basicChainInfo = getChainInfo(data.chainID);
    const address = convertAddress(data.chainID, data.granter);
    const grants: Authorization[] =
      authzChains?.[data.chainID]?.GrantsToMeAddressMapping?.[address] || [];
    let isExpired = false;
    const haveGrant = grants.some((grant) => {
      if (
        (grant.authorization['@type'] ===
          '/cosmos.authz.v1beta1.GenericAuthorization' &&
          grant.authorization.msg === msgReDelegate) ||
        (grant.authorization['@type'] ===
          '/cosmos.staking.v1beta1.StakeAuthorization' &&
          grant.authorization.authorization_type ===
            'AUTHORIZATION_TYPE_REDELEGATE')
      ) {
        isExpired = isTimeExpired(grant.expiration);
        return true;
      } else return false;
    });
    if (isExpired) {
      dispatch(
        setError({
          type: 'error',
          message: `Your Re-delegate permission on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account is expired`,
        })
      );
      return;
    }
    if (!haveGrant) {
      dispatch(
        setError({
          type: 'error',
          message: `You don't have permission to ReDelegate on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account`,
        })
      );
    } else {
      const { minimalDenom } = getDenomInfo(data.chainID);
      const msg = AuthzExecReDelegateMsg(
        data.grantee,
        address,
        data.srcValidator,
        data.validator,
        data.amount,
        data.denom
      );
      dispatch(
        txReDelegate({
          isAuthzMode: true,
          basicChainInfo,
          msgs: [msg],
          memo: '',
          denom: minimalDenom,
          authzChainGranter: address,
        })
      );
    }
  };

  const txAuthzClaim = (data: AuthzExecHelpWithdrawRewards) => {
    const basicChainInfo = getChainInfo(data.chainID);
    const address = convertAddress(data.chainID, data.granter);
    const grants: Authorization[] =
      authzChains?.[data.chainID]?.GrantsToMeAddressMapping?.[address] || [];
    let isExpired = false;
    const haveGrant = grants.some((grant) => {
      if (
        grant.authorization['@type'] ===
          '/cosmos.authz.v1beta1.GenericAuthorization' &&
        grant.authorization.msg === AUTHZ_WITHDRAW_MSG
      ) {
        isExpired = isTimeExpired(grant.expiration);
        return true;
      } else return false;
    });
    if (isExpired) {
      dispatch(
        setError({
          type: 'error',
          message: `Your Claim Rewards permission on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account is expired`,
        })
      );
      return;
    }
    if (!haveGrant) {
      dispatch(
        setError({
          type: 'error',
          message: `You don't have required permissions to do this action on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account`,
        })
      );
    } else {
      const { minimalDenom } = getDenomInfo(data.chainID);
      const pairs = data.pairs.map((pair) => {
        pair.delegator = address;
        return pair;
      });
      const msg = AuthzExecWithdrawRewardsMsg(data.grantee, pairs);
      dispatch(
        txWithdrawAllRewards({
          isAuthzMode: true,
          basicChainInfo,
          msgs: [msg],
          memo: '',
          denom: minimalDenom,
          authzChainGranter: address,
          isTxAll: data.isTxAll,
        })
      );
    }
  };

  const txAuthzCancelUnbond = (data: AuthzExecHelpCancelUnbond) => {
    const basicChainInfo = getChainInfo(data.chainID);
    const address = convertAddress(data.chainID, data.granter);
    const grants: Authorization[] =
      authzChains?.[data.chainID]?.GrantsToMeAddressMapping?.[address] || [];
    let isExpired = false;
    const haveGrant = grants.some((grant) => {
      if (
        grant.authorization['@type'] ===
          '/cosmos.authz.v1beta1.GenericAuthorization' &&
        grant.authorization.msg === msgUnbonding
      ) {
        isExpired = isTimeExpired(grant.expiration);
        return true;
      } else return false;
    });
    if (isExpired) {
      dispatch(
        setError({
          type: 'error',
          message: `Your Cancel Unbonding permission on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account is expired`,
        })
      );
      return;
    }
    if (!haveGrant) {
      dispatch(
        setError({
          type: 'error',
          message: `You don't have required permissions to do this action on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account`,
        })
      );
    } else {
      const { minimalDenom } = getDenomInfo(data.chainID);
      const msg = AuthzExecMsgCancelUnbond(data.msg, data.grantee);
      dispatch(
        txCancelUnbonding({
          isAuthzMode: true,
          basicChainInfo,
          msgs: [msg],
          memo: '',
          denom: minimalDenom,
          authzChainGranter: address,
        })
      );
    }
  };

  const txAuthzRestake = (data: AuthzExecHelpRestake) => {
    const basicChainInfo = getChainInfo(data.chainID);
    const address = convertAddress(data.chainID, data.granter);
    const grants: Authorization[] =
      authzChains?.[data.chainID]?.GrantsToMeAddressMapping?.[address] || [];
    let isExpired = false;
    const haveGrant = grants.some((grant) => {
      if (
        (grant.authorization['@type'] ===
          '/cosmos.authz.v1beta1.GenericAuthorization' &&
          grant.authorization.msg === msgDelegate) ||
        (grant.authorization['@type'] ===
          '/cosmos.staking.v1beta1.StakeAuthorization' &&
          grant.authorization.authorization_type ===
            'AUTHORIZATION_TYPE_DELEGATE')
      ) {
        isExpired = isTimeExpired(grant.expiration);
        return true;
      } else return false;
    });
    if (isExpired) {
      dispatch(
        setError({
          type: 'error',
          message: `Your Restake permission on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account is expired`,
        })
      );
      return;
    }
    if (!haveGrant) {
      dispatch(
        setError({
          type: 'error',
          message: `You don't have required permissions to do this action on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account`,
        })
      );
    } else {
      const { minimalDenom } = getDenomInfo(data.chainID);
      const msg = AuthzExecMsgRestake(data.msgs, data.grantee);
      dispatch(
        txRestake({
          isAuthzMode: true,
          basicChainInfo,
          msgs: [msg],
          memo: '',
          denom: minimalDenom,
          authzChainGranter: address,
          isTxAll: data.isTxAll,
        })
      );
    }
  };

  return {
    txAuthzDelegate,
    txAuthzUnDelegate,
    txAuthzReDelegate,
    txAuthzClaim,
    txAuthzCancelUnbond,
    txAuthzRestake,
  };
};

export default useAuthzStakingExecHelper;
