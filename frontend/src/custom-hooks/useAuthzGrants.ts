import { exitAuthzMode } from '@/store/features/authz/authzSlice';
import { resetAuthz as resetBankAuthz } from '@/store/features/bank/bankSlice';
import { resetAuthz as resetRewardsAuthz } from '@/store/features/distribution/distributionSlice';
import { resetAuthz as resetStakingAuthz } from '@/store/features/staking/stakeSlice';
import {
  COSMOS_CHAIN_ID,
  GENERIC_AUTHORIZATION_TYPE,
  IBC_SEND_TYPE_URL,
  SEND_AUTHORIZATION_TYPE,
  SEND_TYPE_URL,
} from '@/utils/constants';
import { logoutAuthzMode } from '@/utils/localStorage';
import { useAppDispatch, useAppSelector } from './StateHooks';

export interface ChainAuthz {
  chainID: string;
  grant: Authorization;
}
export interface InterChainAuthzGrants {
  cosmosAddress: string;
  address: string;
  grants: ChainAuthz[];
}

const SEND = 'send';
const IBC_TRANSFER = 'ibcTransfer';

const getAuthzType = (grant: Authorization) => {
  if (grant.authorization['@type'] === SEND_AUTHORIZATION_TYPE) {
    return SEND;
  }
  if (grant.authorization['@type'] === GENERIC_AUTHORIZATION_TYPE) {
    if (grant.authorization.msg === SEND_TYPE_URL) {
      return SEND;
    }
    if (grant.authorization.msg === IBC_SEND_TYPE_URL) {
      return IBC_TRANSFER;
    }
  }
  return null;
};

const useAuthzGrants = () => {
  const authzChains = useAppSelector((state) => state.authz.chains);
  const addressToChainAuthz = useAppSelector(
    (state) => state.authz.AddressToChainAuthz
  );
  const dispatch = useAppDispatch();

  const getInterChainGrants = () => {
    const interChainGrants: InterChainAuthzGrants[] = [];

    for (const address of Object.keys(addressToChainAuthz)) {
      const cosmosAddress = address;
      let keyAddress = address;
      const chainAuthzs = [];

      for (const chainID of Object.keys(addressToChainAuthz[address])) {
        chainAuthzs.push(
          ...addressToChainAuthz[address][chainID].map((grant) => ({
            chainID,
            grant,
          }))
        );
      }

      if (!addressToChainAuthz[address][COSMOS_CHAIN_ID]?.length) {
        for (const chainID of Object.keys(addressToChainAuthz[address])) {
          if (addressToChainAuthz[address][chainID].length) {
            keyAddress = addressToChainAuthz[address][chainID][0].granter;
          }
        }
      }

      if (chainAuthzs.length)
        interChainGrants.push({
          cosmosAddress,
          address: keyAddress,
          grants: chainAuthzs,
        });
    }

    return interChainGrants;
  };

  const getGrantsToMe = (chainIDs: string[]) => {
    let grants: AddressGrants[] = [];
    chainIDs && chainIDs.forEach((chainID) => {

      Object.keys(authzChains[chainID]?.GrantsToMeAddressMapping || {}).forEach(
        (address) => {
          grants = [
            ...grants,
            {
              address,
              chainID,
              grants: authzChains[chainID].GrantsToMeAddressMapping[address],
            },
          ];
        }
      );
    });
    return grants;
  };

  const getGrantsByMe = (chainIDs: string[]) => {
    let grants: AddressGrants[] = [];
    chainIDs && chainIDs.forEach((chainID) => {
      Object.keys(authzChains[chainID]?.GrantsByMeAddressMapping || {}).forEach(
        (address) => {
          grants = [
            ...grants,
            {
              address,
              chainID,
              grants: authzChains[chainID].GrantsByMeAddressMapping[address],
            },
          ];
        }
      );
    });
    return grants;
  };

  const getSendAuthzGrants = (chainIDs: string[]) => {
    const sendGrantsData = { send: 0, ibcTransfer: 0 };
    chainIDs &&
      chainIDs.forEach((chainID) => {
        Object.keys(
          authzChains[chainID]?.GrantsByMeAddressMapping || {}
        ).forEach((address) => {
          authzChains[chainID].GrantsByMeAddressMapping[address].forEach((grant) => {
            const authType = getAuthzType(grant);
            if (authType === SEND) {
              sendGrantsData.send = sendGrantsData.send + 1;
            } else if (authType === IBC_TRANSFER) {
              sendGrantsData.ibcTransfer = sendGrantsData.ibcTransfer + 1;
            }
          })
        });
      });
    return sendGrantsData;
  };

  const disableAuthzMode = () => {
    dispatch(resetBankAuthz());
    dispatch(resetRewardsAuthz());
    dispatch(resetStakingAuthz());
    dispatch(exitAuthzMode());
    logoutAuthzMode();
  };

  return {
    getGrantsByMe,
    getGrantsToMe,
    getInterChainGrants,
    disableAuthzMode,
    getSendAuthzGrants,
  };
};

export default useAuthzGrants;
