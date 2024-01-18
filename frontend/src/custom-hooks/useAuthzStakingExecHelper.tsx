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
import {
  GENERIC_AUTHORIZATION_TYPE,
  STAKE_AUTHORIZATION_TYPE,
} from '@/utils/constants';

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

export interface authzFilterOptions {
  generic: {
    msg: string;
  };
  stake?: {
    type: string;
  };
}

export const haveGenericGrant = (grant: Authorization, msg: string) => {
  return (
    grant.authorization['@type'] === GENERIC_AUTHORIZATION_TYPE &&
    grant.authorization.msg === msg
  );
};

export const haveStakeGrant = (grant: Authorization, stakeType: string) => {
  return (
    grant.authorization['@type'] === STAKE_AUTHORIZATION_TYPE &&
    grant.authorization.authorization_type === stakeType
  );
};

export const haveAuthorization = (
  grants: Authorization[],
  options: authzFilterOptions
) => {
  let isExpired = false;

  const haveGrant = grants.some((grant) => {
    if (
      haveGenericGrant(grant, options.generic.msg) ||
      (options.stake && haveStakeGrant(grant, options.stake.type))
    ) {
      isExpired = isTimeExpired(grant.expiration);
      return true;
    } else return false;
  });

  return { isExpired: isExpired, haveGrant: haveGrant };
};

export const AUTHZ_VOTE_MSG = '/cosmos.gov.v1beta1.MsgVote';
export const AUTHZ_DEPOSIT_MSG = '/cosmos.gov.v1beta1.MsgDeposit';
const AUTHZ_WITHDRAW_MSG =
  '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward';

const useAuthzStakingExecHelper = () => {
  const { convertAddress } = useAddressConverter();
  const dispatch = useAppDispatch();
  const authzChains = useAppSelector((state) => state.authz.chains);
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const isInvalidAction = (
    isExpired: boolean,
    haveGrant: boolean,
    chainName: string,
    action: string
  ) => {
    if (isExpired) {
      throwGrantExpiredError(chainName, action);
      return true;
    }

    if (!haveGrant) {
      throwGrantNotFoundError(chainName, action);
      return true;
    }

    return false;
  };

  const throwGrantExpiredError = (chainName: string, action: string) => {
    dispatch(
      setError({
        type: 'error',
        message: `Your ${action} permission on ${capitalizeFirstLetter(
          chainName
        )} from this account is expired`,
      })
    );
  };

  const throwGrantNotFoundError = (chainName: string, action: string) => {
    dispatch(
      setError({
        type: 'error',
        message: `You don't have permission to ${action} on ${capitalizeFirstLetter(
          chainName
        )} from this account`,
      })
    );
  };

  const txAuthzDelegate = (data: AuthzExecHelpDelegate) => {
    const basicChainInfo = getChainInfo(data.chainID);
    const address = convertAddress(data.chainID, data.granter);
    const grants: Authorization[] =
      authzChains?.[data.chainID]?.GrantsToMeAddressMapping?.[address] || [];

    const authzFilters: authzFilterOptions = {
      generic: {
        msg: msgDelegate,
      },
      stake: {
        type: 'AUTHORIZATION_TYPE_DELEGATE',
      },
    };

    const { haveGrant, isExpired } = haveAuthorization(grants, authzFilters);

    if (
      isInvalidAction(
        isExpired,
        haveGrant,
        basicChainInfo.chainName,
        'Delegate'
      )
    )
      return;
    else {
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

    const authzFilters: authzFilterOptions = {
      generic: {
        msg: msgUnDelegate,
      },
      stake: {
        type: 'AUTHORIZATION_TYPE_UNDELEGATE',
      },
    };

    const { haveGrant, isExpired } = haveAuthorization(grants, authzFilters);

    if (
      isInvalidAction(
        isExpired,
        haveGrant,
        basicChainInfo.chainName,
        'Un-Delegate'
      )
    )
      return;
    else {
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

    const authzFilters: authzFilterOptions = {
      generic: {
        msg: msgReDelegate,
      },
      stake: {
        type: 'AUTHORIZATION_TYPE_REDELEGATE',
      },
    };

    const { haveGrant, isExpired } = haveAuthorization(grants, authzFilters);

    if (
      isInvalidAction(
        isExpired,
        haveGrant,
        basicChainInfo.chainName,
        'Change Delegation'
      )
    )
      return;
    else {
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

    const authzFilters: authzFilterOptions = {
      generic: {
        msg: AUTHZ_WITHDRAW_MSG,
      },
    };

    const { haveGrant, isExpired } = haveAuthorization(grants, authzFilters);

    if (
      isInvalidAction(
        isExpired,
        haveGrant,
        basicChainInfo.chainName,
        'Claim Rewards'
      )
    )
      return;
    else {
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

    const authzFilters: authzFilterOptions = {
      generic: {
        msg: msgUnbonding,
      },
    };

    const { haveGrant, isExpired } = haveAuthorization(grants, authzFilters);

    if (
      isInvalidAction(
        isExpired,
        haveGrant,
        basicChainInfo.chainName,
        'Cancel Un-bonding'
      )
    )
      return;
    else {
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

    const authzFilters: authzFilterOptions = {
      generic: {
        msg: msgDelegate,
      },
      stake: {
        type: 'AUTHORIZATION_TYPE_DELEGATE',
      },
    };

    const { haveGrant, isExpired } = haveAuthorization(grants, authzFilters);

    if (
      isInvalidAction(
        isExpired,
        haveGrant,
        basicChainInfo.chainName,
        'Re-stake'
      )
    )
      return;
    else {
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
