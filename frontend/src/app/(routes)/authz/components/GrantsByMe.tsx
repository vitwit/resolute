import { useAppSelector } from '@/custom-hooks/StateHooks';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import AuthzCard from './AuthzCard';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import { NO_GRANTS_BY_ME_TEXT } from '@/utils/constants';

const GrantsByMe = ({
  chainIDs,
  handleGrantDialogOpen,
}: {
  chainIDs: string[];
  handleGrantDialogOpen: () => void;
}) => {
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
    <div className="flex justify-center mt-[20%] items-center">
      <CircularProgress size={32} sx={{ color: 'white' }} />
    </div>
  ) : (
    <div className="my-[5%] flex flex-col justify-center items-center">
      <Image
        src="/no-authz-grants-illustration.png"
        width={400}
        height={289}
        alt="no action proposals"
        className="disable-draggable"
      />
      <div className="text-[16px] opacity-50 mt-4 mb-6 leading-normal italic font-extralight text-center">
        {NO_GRANTS_BY_ME_TEXT}
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

export default GrantsByMe;
