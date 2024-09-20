import React from 'react';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import FeegrantByMeLoading from './FeegrantByMeLoading';
import GrantByMeCard from './GrantByMeCard';
import WithConnectionIllustration from '@/components/illustrations/withConnectionIllustration';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { groupBy } from 'lodash';

const FeegrantsByMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsByMe } = useFeeGrants();
  const { convertToCosmosAddress } = useGetChainInfo();
  const addressGrants = getGrantsByMe(chainIDs);
  const loading = useAppSelector(
    (state) => state.feegrant.getGrantsByMeLoading
  );

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

  return (
    <div className="space-y-6 pt-6">
      {Object.entries(groupedGrants).map(([granterKey, grants]) => (
        <div
          className="border-[1px] border-[#565656] rounded-2xl"
          key={granterKey}
        >
          {grants.map((grant, index) => (
            <GrantByMeCard
              key={index}
              chainID={grant.chainID}
              grant={grant?.grants[0]}
              address={grant.address}
            />
          ))}
        </div>
      ))}
      {!!loading ? (
        <FeegrantByMeLoading />
      ) : (
        <>
          {!addressGrants?.length && (
            <WithConnectionIllustration message="No grants by you" />
          )}
        </>
      )}
    </div>
  );
};

export default FeegrantsByMe;
