import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import useAddressConverter from './useAddressConverter';
import { useAppDispatch, useAppSelector } from './StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import useGetChainInfo from './useGetChainInfo';
import { AuthzExecVoteMsg } from '@/txns/authz';
import { txAuthzExec } from '@/store/features/authz/authzSlice';
import { capitalizeFirstLetter } from '@/utils/util';
import { AuthzExecDepositMsg } from '@/txns/authz/exec';

export interface AuthzExecHelpVote {
  grantee: string;
  proposalId: number;
  option: VoteOption;
  granter: string;
  chainID: string;
  metaData: string;
}

export interface AuthzExecHelpDeposit {
  grantee: string;
  proposalId: number;
  amount: number;
  granter: string;
  chainID: string;
  metaData: string;
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
    const haveGrant = grants.some(
      (grant) =>
        grant.authorization['@type'] ===
          '/cosmos.authz.v1beta1.GenericAuthorization' &&
        grant.authorization.msg === AUTHZ_VOTE_MSG
    );
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
        txAuthzExec({
          basicChainInfo,
          msgs: [msg],
          metaData: data.metaData,
          feeDenom: minimalDenom,
        })
      );
    }
  };

  const txAuthzDeposit = (data: AuthzExecHelpDeposit) => {
    const basicChainInfo = getChainInfo(data.chainID);
    const address = convertAddress(data.chainID, data.granter);
    const grants: Authorization[] =
      authzChains?.[data.chainID]?.GrantsToMeAddressMapping?.[address] || [];
    const haveGrant = grants.some(
      (grant) =>
        grant.authorization['@type'] ===
          '/cosmos.authz.v1beta1.GenericAuthorization' &&
        grant.authorization.msg === AUTHZ_DEPOSIT_MSG
    );
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
        txAuthzExec({
          basicChainInfo,
          msgs: [msg],
          metaData: data.metaData,
          feeDenom: minimalDenom,
        })
      );
    }
  };
  return { txAuthzVote, txAuthzDeposit };
};

export default useAuthzExecHelper;
