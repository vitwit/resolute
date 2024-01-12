import { useAppSelector } from '@/custom-hooks/StateHooks';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import AuthzCard from './AuthzCard';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import { NO_GRANTS_TO_ME_TEXT } from '@/utils/constants';

const GrantsToMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsToMe } = useAuthzGrants();
  const addressGrants = getGrantsToMe(chainIDs);
  const loading = useAppSelector((state) => state.authz.getGrantsToMeLoading);

  return addressGrants.length ? (
    <>
      <div className="authz-card-grid">
        {addressGrants.map((addressGrant) => (
          <AuthzCard
            key={addressGrant.chainID}
            chainID={addressGrant.chainID}
            address={addressGrant.address}
            grants={addressGrant.grants}
            showCloseIcon={false}
            grantee={''}
            granter={''}
            isGrantsByMe={false}
          />
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
              {NO_GRANTS_TO_ME_TEXT}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantsToMe;
