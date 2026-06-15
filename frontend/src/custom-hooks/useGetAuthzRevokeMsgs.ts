import useGetChainInfo from './useGetChainInfo';
import { AuthzRevokeMsg } from '@/txns/authz';
import useGetFeegranter from './useGetFeegranter';
import { MAP_TXN_MSG_TYPES } from '@/utils/feegrant';

const useGetAuthzRevokeMsgs = ({
  granter,
  grantee,
  chainID,
  typeURLs,
}: {
  granter: string;
  grantee: string;
  chainID: string;
  typeURLs: string[];
}) => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const basicChainInfo = getChainInfo(chainID);
  const { decimals, minimalDenom } = getDenomInfo(chainID);
  const { getFeegranter } = useGetFeegranter();
  const { feeAmount: avgFeeAmount } = basicChainInfo;
  const feeAmount = avgFeeAmount * 10 ** decimals;

  const revokeAuthzMsgs: Msg[] = [];
  typeURLs.forEach((typeURL) => {
    const msg = AuthzRevokeMsg(granter, grantee, typeURL);
    revokeAuthzMsgs.push(msg);
  });
  const txRevokeAuthzInputs = {
    basicChainInfo: basicChainInfo,
    denom: minimalDenom,
    feeAmount: feeAmount,
    feegranter: getFeegranter(chainID, MAP_TXN_MSG_TYPES['revoke_authz']),
    msgs: revokeAuthzMsgs,
  };
  return {
    txRevokeAuthzInputs,
  };
};

export default useGetAuthzRevokeMsgs;
