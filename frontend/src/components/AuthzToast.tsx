import { useAppSelector } from '@/custom-hooks/StateHooks';
import React from 'react';
import { AddressChip } from './DialogAuthzGrants';
import Image from 'next/image';
import useAddressConverter from '@/custom-hooks/useAddressConverter';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';

const AuthzToast = ({
  chainIDs,
  margins,
}: {
  chainIDs: string[];
  margins: string;
}) => {
  const { convertAddress } = useAddressConverter();
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const { disableAuthzMode } = useAuthzGrants();

  const address =
    chainIDs.length > 1
      ? authzAddress
      : convertAddress(chainIDs[0], authzAddress);
  return isAuthzMode ? (
    <div
      className={'flex justify-between items-center px-6 py-4 ' + margins}
      style={{ background: 'rgba(217, 217, 217, 0.10)' }}
    >
      <div className="flex items-center gap-[10px]">
        <Image src="/warning.svg" width={32} height={32} alt="authz" />
        <div className="text-[#EFFF34] text-base not-italic font-semibold leading-[normal]">
          You are now logged in as{' '}
        </div>
        <AddressChip address={address} />
      </div>
      <div
        className="text-white text-base not-italic font-medium leading-5 tracking-[0.64px] underline cursor-pointer"
        onClick={() => {
          disableAuthzMode();
        }}
      >
        Exit Authz Mode
      </div>
    </div>
  ) : null;
};

export default AuthzToast;
