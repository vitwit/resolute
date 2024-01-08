import { useAppSelector } from '@/custom-hooks/StateHooks';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';

const GrantsToMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsToMe } = useAuthzGrants();
  const addressGrants = getGrantsToMe(chainIDs);
  const loading = useAppSelector((state) => state.authz.getGrantsToMeLoading);

  return addressGrants.length ? (
    <>
      {addressGrants.map((addressGrant) => (
        <>{JSON.stringify(addressGrant)}</>
      ))}
     
    </>
  ) : !!loading ? (
    'Loading'
  ) : (
    'No grants'
  );
};

export default GrantsToMe;
