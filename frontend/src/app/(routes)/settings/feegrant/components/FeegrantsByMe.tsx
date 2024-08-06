import React from 'react';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import FeegrantByMeLoading from './FeegrantByMeLoading';
import GrantByMeCard from './GrantByMeCard';

const FeegrantsByMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsByMe } = useFeeGrants();
  const addressGrants = getGrantsByMe(chainIDs);
  const loading = useAppSelector(
    (state) => state.feegrant.getGrantsByMeLoading
  );

  return (
    <div className="space-y-6 pt-6">
      {addressGrants?.length ? (
        <>
          {addressGrants.map((addressGrant) => (
            <>
              {!!addressGrant.grants.length && (
                <GrantByMeCard
                  chainID={addressGrant.chainID}
                  grant={addressGrant?.grants[0]}
                  address={addressGrant.address}
                />
              )}
            </>
          ))}
        </>
      ) : (
        <div>No grants by you</div>
      )}
      {!!loading ? <FeegrantByMeLoading /> : null}
    </div>
  );
};

export default FeegrantsByMe;
