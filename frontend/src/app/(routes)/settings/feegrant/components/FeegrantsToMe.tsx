import React from 'react';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import FeegrantToMeLoading from './FeegrantToMeLoading';
import GrantToMeCard from './GrantToMeCard';

const FeegrantsToMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsToMe } = useFeeGrants();
  const addressGrants = getGrantsToMe(chainIDs);

  const loading = useAppSelector(
    (state) => state.feegrant.getGrantsToMeLoading
  );

  return (
    <div className="space-y-6 pt-6">
      {addressGrants?.length ? (
        <>
          {addressGrants.map((addressGrant) => (
            <React.Fragment key={addressGrant.address}>
              {!!addressGrant.grants.length && (
                <GrantToMeCard
                  chainID={addressGrant.chainID}
                  grant={addressGrant?.grants[0]}
                  address={addressGrant.address}
                />
              )}
            </React.Fragment>
          ))}
        </>
      ) : !!loading ? (
        <FeegrantToMeLoading />
      ) : (
        // TODO: Display empty illutration
        <div>No Feegrants</div>
      )}
    </div>
  );
};

export default FeegrantsToMe;
