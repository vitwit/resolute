import { useAppSelector } from '@/custom-hooks/StateHooks';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import AuthzCard from './AuthzCard';

const GrantsByMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsByMe } = useAuthzGrants();
  const addressGrants = getGrantsByMe(chainIDs);
  const loading = useAppSelector((state) => state.authz.getGrantsByMeLoading);

  return addressGrants.length ? (
    <>
      <div className="authz-card-grid">
        {addressGrants.map((addressGrant) => (
          <>
            {!!addressGrant.grants.length && (
              <AuthzCard
                key={addressGrant.chainID}
                chainID={addressGrant.chainID}
                address={addressGrant.address}
                grants={addressGrant.grants}
                grantee={addressGrant.address}
                granter={addressGrant.grants[0].granter}
                isGrantsByMe={true}
              />
            )}
          </>
        ))}
      </div>
    </>
  ) : !!loading ? (
    'Loading'
  ) : (
    'No grants'
  );
};

export default GrantsByMe;
