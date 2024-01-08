import { useAppSelector } from './StateHooks';

const useAuthzGrants = () => {
  const authzChains = useAppSelector((state) => state.authz.chains);

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

  return { getGrantsByMe, getGrantsToMe };
};

export default useAuthzGrants;
