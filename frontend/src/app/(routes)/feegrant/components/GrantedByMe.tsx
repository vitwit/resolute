import { useAppSelector } from '@/custom-hooks/StateHooks';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import { NO_FEEGRANTS_BY_ME_TEXT } from '@/utils/constants';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import FeegrantCard from './FeegrantCard';

const GrantedByMe = ({
  chainIDs,
  handleGrantDialogOpen,
}: {
  chainIDs: string[];
  handleGrantDialogOpen: () => void;
}) => {
  const { getGrantsByMe } = useFeeGrants();
  const addressGrants = getGrantsByMe(chainIDs);
  const loading = useAppSelector(
    (state) => state.feegrant.getGrantsByMeLoading
  );

  return addressGrants.length ? (
    <>
      <div className="feegrant-card-grid">
        {addressGrants.map((addressGrant) => (
          <>{!!addressGrant.grants.length && 
            <FeegrantCard chainID={addressGrant.chainID} expiration={''} address={addressGrant.address} spendLimit={''} isperiodic={true}/>}</>
        ))}
        
      </div>
    </>
  ) : !!loading ? (
    <div className="flex justify-center mt-[20%] items-center">
      <CircularProgress size={32} sx={{ color: 'white' }} />
    </div>
  ) : (
    <div className="my-[5%] flex flex-col justify-center items-center">
      <Image
        src="/no-authz-grants-illustration.png"
        width={400}
        height={289}
        alt="no feegrants"
        className="disable-draggable"
      />
      <div className="text-[16px] opacity-50 mt-4 mb-6 leading-normal italic font-extralight text-center">
        {NO_FEEGRANTS_BY_ME_TEXT}
      </div>
      <button
        onClick={handleGrantDialogOpen}
        className="primary-custom-btn mb-6"
      >
        Create Grant
      </button>
    </div>
  );
};

export default GrantedByMe;
