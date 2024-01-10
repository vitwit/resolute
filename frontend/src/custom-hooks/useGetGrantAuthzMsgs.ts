import { AuthzGenericGrantMsg, AuthzSendGrantMsg } from '@/txns/authz';
import useGetChainInfo from './useGetChainInfo';
import { MAP_TXN_MSG_TYPES } from '@/utils/authorizations';
import { getAddressByPrefix } from '@/utils/address';
import { AuthzStakeGrantMsg } from '@/txns/authz/grant';
import { amountToMinimalValue } from '@/utils/util';

interface ChainGrants {
  chainID: string;
  msgs: Msg[];
}

const MAP_STAKE_AUTHZ_TYPE: Record<string, number> = {
  delegate: 1,
  undelegate: 2,
  redelegate: 3,
};

const useGetGrantAuthzMsgs = () => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const getGrantAuthzMsgs = ({
    grantsList,
    selectedChains,
    granteeAddress,
  }: {
    grantsList: Grant[];
    selectedChains: string[];
    granteeAddress: string;
  }) => {
    const chainWiseGrants: ChainGrants[] = [];

    selectedChains.forEach((chainID) => {
      const { address: granterAddress, prefix } = getChainInfo(chainID);
      const { minimalDenom, decimals } = getDenomInfo(chainID);
      const msgs: Msg[] = [];
      const sendAuthz = 'send';
      const stakeAuthzs = ['delegate', 'undelegate', 'redelegate'];
      grantsList.forEach((grant) => {
        const grantee = getAddressByPrefix(granteeAddress, prefix);
        const typeUrl = MAP_TXN_MSG_TYPES[grant.msg];
        const expiration = grant.expiration.toISOString();
        if (
          grant.msg === sendAuthz &&
          'spend_limit' in grant &&
          grant.spend_limit
        ) {
          const msg = AuthzSendGrantMsg(
            granterAddress,
            grantee,
            minimalDenom,
            amountToMinimalValue(Number(grant.spend_limit), decimals),
            expiration
          );
          msgs.push(msg);
        } else if (stakeAuthzs.includes(grant.msg)) {
          if (
            stakeAuthzs.includes(grant.msg) &&
            'validators_list' in grant &&
            'isDenyList' in grant &&
            grant.validators_list?.length
          ) {
            const msg = AuthzStakeGrantMsg({
              expiration: expiration,
              granter: granterAddress,
              grantee: grantee,
              stakeAuthzType: MAP_STAKE_AUTHZ_TYPE[grant.msg],
              allowList: grant.isDenyList ? undefined : grant.validators_list,
              denyList: grant.isDenyList ? grant.validators_list : undefined,
              denom: minimalDenom,
              maxTokens: amountToMinimalValue(
                Number(grant?.max_tokens),
                decimals
              ).toString(),
            });
            msgs.push(msg);
          } else {
            const msg = AuthzGenericGrantMsg(
              granterAddress,
              grantee,
              typeUrl,
              expiration
            );
            msgs.push(msg);
          }
        } else {
          const msg = AuthzGenericGrantMsg(
            granterAddress,
            grantee,
            typeUrl,
            expiration
          );
          msgs.push(msg);
        }
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
