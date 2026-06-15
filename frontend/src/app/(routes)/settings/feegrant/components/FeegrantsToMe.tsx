import React from 'react';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import FeegrantToMeLoading from './FeegrantToMeLoading';
import GrantToMeCard from './GrantToMeCard';
import WithConnectionIllustration from '@/components/illustrations/withConnectionIllustration';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { groupBy } from 'lodash';

const FeegrantsToMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsToMe } = useFeeGrants();
  const { convertToCosmosAddress } = useGetChainInfo();
  const addressGrants = getGrantsToMe(chainIDs);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  let grantsList: any[] = [];
  addressGrants.forEach((grant) => {
    const data = {
      ...grant,
      cosmosAddress: convertToCosmosAddress(grant.address),
    };
    grantsList = [...grantsList, data];
  });
  const groupedGrants = groupBy(grantsList, 'cosmosAddress');

  const loading = useAppSelector(
    (state) => state.feegrant.getGrantsToMeLoading
  );

  return (
    <div className="space-y-6 pt-6">
      {Object.entries(groupedGrants).map(([granterKey, grants]) => (
        <div
          className="border-[1px] border-[#565656] rounded-2xl"
          key={granterKey}
        >
          {grants.map((grant, index) => (
            <GrantToMeCard
              key={index}
              chainID={grant.chainID}
              grant={grant?.grants[0]}
              address={grant.address}
            />
          ))}
        </div>
      ))}
      {!!loading ? (
        <FeegrantToMeLoading />
      ) : (
        <>
          {!addressGrants?.length && (
            <WithConnectionIllustration message="No Feegrants" />
          )}
        </>
      )}
    </div>
  );
};

export default FeegrantsToMe;
