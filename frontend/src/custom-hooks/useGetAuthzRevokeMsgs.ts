import useGetChainInfo from './useGetChainInfo';
import { AuthzRevokeMsg } from '@/txns/authz';

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
    feegranter: '',
    msgs: revokeAuthzMsgs,
  };
  return {
    txRevokeAuthzInputs,
  };
};

export default useGetAuthzRevokeMsgs;
