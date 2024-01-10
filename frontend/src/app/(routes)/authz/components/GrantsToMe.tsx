import { useAppSelector } from '@/custom-hooks/StateHooks';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import AuthzCard from './AuthzCard';

const GrantsToMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsToMe } = useAuthzGrants();
  const addressGrants = getGrantsToMe(chainIDs);
  const loading = useAppSelector((state) => state.authz.getGrantsToMeLoading);

  return addressGrants.length ? (
    <>
      <div className="authz-card-grid">
        {addressGrants.map((addressGrant) => (
          // <>{JSON.stringify(addressGrant)
          // }</>

          <AuthzCard
          key={addressGrant.chainID}
            chainID={addressGrant.chainID}
            address={addressGrant.address}
            grants={addressGrant.grants}
            showCloseIcon={false}
          />
        ))}
      </div>
    </>
  ) : !!loading ? (
    'Loading'
  ) : (
    'No grants'
  );
};

export default GrantsToMe;
