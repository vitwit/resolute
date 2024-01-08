import { useAppSelector } from '@/custom-hooks/StateHooks';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';

const GrantsByMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsByMe } = useAuthzGrants();
  const addressGrants = getGrantsByMe(chainIDs);
  const loading = useAppSelector((state) => state.authz.getGrantsByMeLoading);

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

export default GrantsByMe;
