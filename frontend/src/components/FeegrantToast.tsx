import { useAppSelector } from '@/custom-hooks/StateHooks';
import React from 'react';
import { AddressChip } from './DialogFeegrants';
import Image from 'next/image';
import useAddressConverter from '@/custom-hooks/useAddressConverter';
import useFeeGrants from '@/custom-hooks/useFeeGrants';

const FeegrantToast = ({
  chainIDs,
  margins,
}: {
  chainIDs: string[];
  margins: string;
}) => {
  const { convertAddress } = useAddressConverter();
  const isFeegrantMode = useAppSelector(
    (state) => state.feegrant.feegrantModeEnabled
  );
  const feegranterAddress = useAppSelector(
    (state) => state.feegrant.feegrantAddress
  );
  const { disableFeegrantMode } = useFeeGrants();

  const address =
    chainIDs.length > 1
      ? feegranterAddress
      : convertAddress(chainIDs[0], feegranterAddress);
  return isFeegrantMode ? (
    <div
      className={
        'flex justify-between items-center px-6 py-4 rounded-2xl ' + margins
      }
      style={{ background: 'rgba(217, 217, 217, 0.10)' }}
    >
      <div className="flex items-center gap-[10px]">
        <Image src="/warning.svg" width={32} height={32} alt="warning" />
        <div className="text-[#EFFF34] text-base not-italic font-semibold leading-[normal]">
          Transaction fees will be deducted from{' '}
        </div>
        <AddressChip address={address} />
      </div>
      <div
        className="text-white text-base not-italic font-medium leading-5 tracking-[0.64px] underline cursor-pointer"
        onClick={() => {
          disableFeegrantMode();
        }}
      >
        Exit Feegrant Mode
      </div>
    </div>
  ) : null;
};

export default FeegrantToast;
