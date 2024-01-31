import { COSMOS_CHAIN_ID } from '@/utils/constants';
import { useAppDispatch, useAppSelector } from './StateHooks';
import { exitFeegrantMode } from '@/store/features/feegrant/feegrantSlice';
import { logoutFeegrantMode } from '@/utils/localStorage';

export interface ChainAllowance {
  chainID: string;
  grant: Allowance;
}
export interface InterChainFeegrants {
  cosmosAddress: string;
  address: string;
  grants: ChainAllowance[];
}

const useFeeGrants = () => {
  const dispatch = useAppDispatch();
  const feegrantChains = useAppSelector((state) => state.feegrant.chains);
  const addressToChainFeegrant = useAppSelector(
    (state) => state.feegrant.addressToChainFeegrant
  );

  const getInterChainGrants = () => {
    const interChainGrants: InterChainFeegrants[] = [];

    for (const address of Object.keys(addressToChainFeegrant)) {
      const cosmosAddress = address;
      let keyAddress = address;
      const chainFeegrants = [];

      for (const chainID of Object.keys(addressToChainFeegrant[address])) {
        chainFeegrants.push(
          ...addressToChainFeegrant[address][chainID].map((grant) => ({
            chainID,
            grant,
          }))
        );
      }

      if (!addressToChainFeegrant[address][COSMOS_CHAIN_ID]?.length) {
        for (const chainID of Object.keys(addressToChainFeegrant[address])) {
          if (addressToChainFeegrant[address][chainID].length) {
            keyAddress = addressToChainFeegrant[address][chainID][0].granter;
          }
        }
      }

      if (chainFeegrants.length)
        interChainGrants.push({
          cosmosAddress,
          address: keyAddress,
          grants: chainFeegrants,
        });
    }

    return interChainGrants;
  };

  const getGrantsToMe = (chainIDs: string[]) => {
    let grants: AddressFeegrants[] = [];
    chainIDs.forEach((chainID) => {
      Object.keys(
        feegrantChains[chainID]?.grantsToMeAddressMapping || {}
      ).forEach((address) => {
        grants = [
          ...grants,
          {
            address,
            chainID,
            grants: feegrantChains[chainID].grantsToMeAddressMapping[address],
          },
        ];
      });
    });
    return grants;
  };

  const getGrantsByMe = (chainIDs: string[]) => {
    let grants: AddressFeegrants[] = [];
    chainIDs.forEach((chainID) => {
      Object.keys(
        feegrantChains[chainID]?.grantsByMeAddressMapping || {}
      ).forEach((address) => {
        grants = [
          ...grants,
          {
            address,
            chainID,
            grants: feegrantChains[chainID].grantsByMeAddressMapping[address],
          },
        ];
      });
    });
    return grants;
  };

  const disableFeegrantMode = () => {
    dispatch(exitFeegrantMode());
    logoutFeegrantMode();
  };

  return {
    getGrantsByMe,
    getGrantsToMe,
    getInterChainGrants,
    disableFeegrantMode,
  };
};

export default useFeeGrants;
