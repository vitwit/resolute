import { AuthzGenericGrantMsg } from '@/txns/authz';
import useGetChainInfo from './useGetChainInfo';
import { MAP_TXN_MSG_TYPES } from '@/utils/authorizations';
import { getAddressByPrefix } from '@/utils/address';

interface ChainGrants {
  chainID: string;
  msgs: Msg[];
}

const useGetGrantAuthzMsgs = () => {
  const { getChainInfo } = useGetChainInfo();

  const getGrantAuthzMsgs = ({
    grantsList,
    selectedChains,
    granteeAddress,
  }: {
    grantsList: SendGrant[] | GenericGrant[];
    selectedChains: string[];
    granteeAddress: string;
  }) => {
    const chainWiseGrants: ChainGrants[] = [];

    selectedChains.forEach((chainID) => {
      const { address: granterAddress, prefix } = getChainInfo(chainID);
      const msgs: Msg[] = [];
      grantsList.forEach((grant) => {
        const msg = AuthzGenericGrantMsg(
          granterAddress,
          getAddressByPrefix(granteeAddress, prefix),
          MAP_TXN_MSG_TYPES[grant.msg],
          grant.expiration.toISOString()
        );
        msgs.push(msg);
      });
      chainWiseGrants.push({
        chainID: chainID,
        msgs: msgs,
      });
    });
    return {
      chainWiseGrants,
    };
  };

  return { getGrantAuthzMsgs };
};

export default useGetGrantAuthzMsgs;
