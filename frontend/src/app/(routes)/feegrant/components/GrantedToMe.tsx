import { useAppSelector } from '@/custom-hooks/StateHooks';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import { NO_FEEGRANTS_TO_ME_TEXT } from '@/utils/constants';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import FeegrantCard from './FeegrantCard';

const GrantedToMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsToMe } = useFeeGrants();
  const addressGrants = getGrantsToMe(chainIDs);
  const loading = useAppSelector(
    (state) => state.feegrant.getGrantsToMeLoading
  );

  return addressGrants.length ? (
    <>
      <div className="feegrant-card-grid">
        {addressGrants.map((addressGrant) => (
           <>{!!addressGrant.grants.length && 
            <FeegrantCard chainID={addressGrant.chainID} expiration={''} address={addressGrant.address} spendLimit={''} isPeriodic={false}  isGrantsByMe={false} />}</>
        ))}
        </div>
    </>
  ) : !!loading ? (
    <div className="flex justify-center mt-[20%] items-center">
      <CircularProgress size={32} sx={{ color: 'white' }} />
    </div>
  ) : (
    <div className="space-y-4 w-full mt-[10%]">
      <div className="flex justify-between">
        <div className="flex flex-1">
          <div className="flex flex-col flex-1 justify-center items-center space-y-4">
            <Image
              src="/no-authz-grants-illustration.png"
              width={400}
              height={289}
              alt="no action proposals"
              className="disable-draggable"
            />
            <p className="text-white text-center text-base italic font-extralight leading-[normal] flex justify-center opacity-50">
              {NO_FEEGRANTS_TO_ME_TEXT}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GrantedToMe;
