import { useAppDispatch, useAppSelector } from './StateHooks';
import { exitAuthzMode } from '@/store/features/authz/authzSlice';
import { resetAuthz as resetBankAuthz } from '@/store/features/bank/bankSlice';
import { resetAuthz as resetRewardsAuthz } from '@/store/features/distribution/distributionSlice';
import { resetAuthz as resetStakingAuthz } from '@/store/features/staking/stakeSlice';

export interface ChainAuthz {
  chainID: string;
  grant: Authorization;
}
export interface InterChainAuthzGrants {
  cosmosAddress: string;
  address: string;
  grants: ChainAuthz[];
}

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

      if (!addressToChainAuthz[address]['cosmoshub-4']?.length) {
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
    chainIDs.forEach((chainID) => {
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
    chainIDs.forEach((chainID) => {
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

  const disableAuthzMode = () => {
    dispatch(resetBankAuthz());
    dispatch(resetRewardsAuthz());
    dispatch(resetStakingAuthz());
    dispatch(exitAuthzMode());
  };

  return {
    getGrantsByMe,
    getGrantsToMe,
    getInterChainGrants,
    disableAuthzMode,
  };
};

export default useAuthzGrants;
