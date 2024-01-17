import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import useAddressConverter from './useAddressConverter';
import { useAppDispatch, useAppSelector } from './StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import useGetChainInfo from './useGetChainInfo';
import { AuthzExecVoteMsg } from '@/txns/authz';
import { capitalizeFirstLetter } from '@/utils/util';
import { AuthzExecDepositMsg, AuthzExecSendMsg } from '@/txns/authz/exec';
import { msgSendTypeUrl } from '@/txns/bank/send';
import { txBankSend } from '@/store/features/bank/bankSlice';
import { txDeposit, txVote } from '@/store/features/gov/govSlice';
import { isTimeExpired } from '@/utils/datetime';

export interface AuthzExecHelpVote {
  grantee: string;
  proposalId: number;
  option: VoteOption;
  granter: string;
  chainID: string;
  memo: string;
}

export interface AuthzExecHelpDeposit {
  grantee: string;
  proposalId: number;
  amount: number;
  granter: string;
  chainID: string;
  memo: string;
}

export interface AuthzExecHelpSend {
  grantee: string;
  recipient: string;
  amount: number;
  denom: string;
  granter: string;
  chainID: string;
  memo: string;
}

export const AUTHZ_VOTE_MSG = '/cosmos.gov.v1beta1.MsgVote';
export const AUTHZ_DEPOSIT_MSG = '/cosmos.gov.v1beta1.MsgDeposit';

const useAuthzExecHelper = () => {
  const { convertAddress } = useAddressConverter();
  const dispatch = useAppDispatch();
  const authzChains = useAppSelector((state) => state.authz.chains);
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const txAuthzVote = (data: AuthzExecHelpVote) => {
    const basicChainInfo = getChainInfo(data.chainID);
    const address = convertAddress(data.chainID, data.granter);
    const grants: Authorization[] =
      authzChains?.[data.chainID]?.GrantsToMeAddressMapping?.[address] || [];
    let isExpired = false;
    const haveGrant = grants.some((grant) => {
      if (
        grant.authorization['@type'] ===
          '/cosmos.authz.v1beta1.GenericAuthorization' &&
        grant.authorization.msg === AUTHZ_VOTE_MSG
      ) {
        isExpired = isTimeExpired(grant.expiration);
        return true;
      } else return false;
    });
    if (isExpired) {
      dispatch(
        setError({
          type: 'error',
          message: `Your Send permission on ${capitalizeFirstLetter(
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
          message: `You don't have permission to Vote on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account`,
        })
      );
    } else {
      const { minimalDenom } = getDenomInfo(data.chainID);
      const msg = AuthzExecVoteMsg(
        data.grantee,
        data.proposalId,
        data.option,
        address
      );
      dispatch(
        txVote({
          isAuthzMode: true,
          basicChainInfo,
          msgs: [msg],
          memo: data.memo,
          denom: minimalDenom,
          authzChainGranter: address,
        })
      );
    }
  };

  const txAuthzDeposit = (data: AuthzExecHelpDeposit) => {
    const basicChainInfo = getChainInfo(data.chainID);
    const address = convertAddress(data.chainID, data.granter);
    const grants: Authorization[] =
      authzChains?.[data.chainID]?.GrantsToMeAddressMapping?.[address] || [];
    let isExpired = false;
    const haveGrant = grants.some((grant) => {
      if (
        grant.authorization['@type'] ===
          '/cosmos.authz.v1beta1.GenericAuthorization' &&
        grant.authorization.msg === AUTHZ_DEPOSIT_MSG
      ) {
        isExpired = isTimeExpired(grant.expiration);
      } else return false;
    });
    if (isExpired) {
      dispatch(
        setError({
          type: 'error',
          message: `Your Deposit permission on ${capitalizeFirstLetter(
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
          message: `You don't have permission to Deposit on ${capitalizeFirstLetter(
            basicChainInfo.chainName
          )} from this account`,
        })
      );
    } else {
      const { minimalDenom } = getDenomInfo(data.chainID);
      const msg = AuthzExecDepositMsg(
        data.grantee,
        data.proposalId,
        address,
        data.amount,
        minimalDenom
      );
      dispatch(
        txDeposit({
          isAuthzMode: true,
          basicChainInfo,
          msgs: [msg],
          memo: data.memo,
          denom: minimalDenom,
          authzChainGranter: address,
        })
      );
    }
  };

  const txAuthzSend = (data: AuthzExecHelpSend) => {
    const basicChainInfo = getChainInfo(data.chainID);
    const address = convertAddress(data.chainID, data.granter);
    const grants: Authorization[] =
      authzChains?.[data.chainID]?.GrantsToMeAddressMapping?.[address] || [];
    let errorMsg = `You don't have permission to Send on ${capitalizeFirstLetter(
      basicChainInfo.chainName
    )} from this account`;
    let isExpired = false;
    const haveGrant = grants.some((grant) => {
      if (
        grant.authorization['@type'] ===
          '/cosmos.authz.v1beta1.GenericAuthorization' &&
        grant.authorization.msg === msgSendTypeUrl
      ) {
        isExpired = isTimeExpired(grant.expiration);
        return true;
      }
      let validSend = false;
      if (
        grant.authorization['@type'] ===
        '/cosmos.bank.v1beta1.SendAuthorization'
      ) {
        isExpired = isTimeExpired(grant.expiration);
        if (grant.authorization?.allow_list?.length) {
          const allowed = grant.authorization.allow_list.some(
            (allowedAddress) => allowedAddress === data.recipient
          );
          if (!allowed) {
            errorMsg = 'You are not allowed send tokens to this address';
            return false;
          }
        }
        grant.authorization.spend_limit.forEach((coin) => {
          if (coin.denom === data.denom) {
            if (+coin.amount < data.amount) {
              errorMsg = 'Spend Limit Exceeded';
            } else {
              validSend = true;
            }
          }
        });
        return validSend;
      }
    });
    if (isExpired) {
      dispatch(
        setError({
          type: 'error',
          message: `Your Send permission on ${capitalizeFirstLetter(
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
          message: errorMsg,
        })
      );
    } else {
      const { minimalDenom } = getDenomInfo(data.chainID);
      const msg = AuthzExecSendMsg(
        data.grantee,
        address,
        data.recipient,
        data.amount,
        data.denom
      );
      dispatch(
        txBankSend({
          isAuthzMode: true,
          basicChainInfo,
          msgs: [msg],
          memo: data.memo,
          denom: minimalDenom,
          authzChainGranter: address,
        })
      );
    }
  };
  return { txAuthzVote, txAuthzDeposit, txAuthzSend };
};

export default useAuthzExecHelper;
