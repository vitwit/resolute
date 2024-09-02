import React, { useState } from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';

import { TICK_ICON } from '@/constants/image-names';
import DialogAuthzDetails from './DialogAuthzDetails';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getMsgNameFromAuthz } from '@/utils/authorizations';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import GrantToMeLoading from './GrantToMeLoading';
import { setAuthzMode } from '@/utils/localStorage';
import { RootState } from '@/store/store';
import { groupBy } from 'lodash';
import { enableAuthzMode } from '@/store/features/authz/authzSlice';
import { exitFeegrantMode } from '@/store/features/feegrant/feegrantSlice';
import { shortenAddress } from '@/utils/util';

const GrantedToMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsToMe } = useAuthzGrants();
  const { convertToCosmosAddress } = useGetChainInfo();

  const authzGrants = getGrantsToMe(chainIDs);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let grantsList: any[] = [];
  authzGrants.forEach((grant) => {
    const data = {
      ...grant,
      cosmosAddress: convertToCosmosAddress(grant.address),
    };
    grantsList = [...grantsList, data];
  });
  const groupedGrants = groupBy(grantsList, 'cosmosAddress');

  const loading = useAppSelector((state) => state.authz.getGrantsByMeLoading);

  return (
    <div className="space-y-6 pt-6">
      {Object.entries(groupedGrants).map(([granterKey, grants]) => (
        <div
          className="border-[1px] border-[#565656] rounded-2xl"
          key={granterKey}
        >
          {grants.map((grant, index) => (
            <GrantToMeCard key={index} index={index} grant={grant} />
          ))}
        </div>
      ))}
      {!!loading ? (
        <GrantToMeLoading />
      ) : (
        <>
          {!authzGrants?.length && (
            <>
              <div>No grants to you</div>
            </>
          )}
        </>
      )}
    </div>
  );
};

const GrantToMeCard = ({
  index,
  grant,
}: {
  index: number;
  grant: AddressGrants;
}) => {
  const dispatch = useAppDispatch();
  const authzData = useAppSelector((state: RootState) => state.authz);
  const { authzModeEnabled, authzAddress: SelectedauthzGranterAddr } =
    authzData;
  const { disableAuthzMode } = useAuthzGrants();

  const { getCosmosAddress, convertToCosmosAddress } = useGetChainInfo();

  const granteeCosmosAddr = getCosmosAddress();
  const granterCosmosAddr = convertToCosmosAddress(grant.address);

  // setAuthzMode(granteeCosmosAddr, granterCosmosAddr);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = () => {
    setDialogOpen(true);
  };

  const { getChainInfo } = useGetChainInfo();
  const { chainLogo } = getChainInfo(grant?.chainID);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const isGranterSelected = (cosmosAddr: string) => {
    return SelectedauthzGranterAddr === cosmosAddr;
  };

  const handleUseAuthz = () => {
    if (authzModeEnabled) {
      disableAuthzMode();
    } else {
      dispatch(enableAuthzMode({ address: granterCosmosAddr }));
      dispatch(exitFeegrantMode());
      setAuthzMode(granteeCosmosAddr, granterCosmosAddr);
    }
  };

  return (
    <div
      className={`grants-card justify-between items-start w-full gap-16
       ${
         isGranterSelected(convertToCosmosAddress(grant?.address))
           ? 'selected-grants-card'
           : ''
       }`}
      key={index}
    >
      <div className="flex flex-col gap-2 w-[280px]">
        <div className="flex gap-2 items-center">
          <p className="text-b1-light">Address</p>
          {isGranterSelected(convertToCosmosAddress(grant?.address)) && (
            <div className="flex space-x-0">
              <Image src={TICK_ICON} width={16} height={16} alt="used-icon" />
              <span className="text-[#2BA472]">Currently Using</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center h-8">
          <p className="truncate text-b1">{shortenAddress(grant.address, 30)}</p>
          <Copy content={grant.address} />
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-b1-light">Permissions</p>
        <div className="flex gap-2 flex-wrap">
          {grant?.grants?.map((g, idx) => (
            <div className="permission-card flex gap-2 items-center" key={idx}>
              <p className="text-b1">{getMsgNameFromAuthz(g)}</p>
              <Image
                src={chainLogo}
                width={20}
                height={20}
                alt="network-logo"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-[21px]" />
        <div className="flex gap-6 items-center">
          <button
            className={
              isGranterSelected(convertToCosmosAddress(grant?.address))
                ? 'cancel-btn'
                : 'primary-btn'
            }
            onClick={handleUseAuthz}
          >
            {isGranterSelected(convertToCosmosAddress(grant?.address))
              ? 'Cancel'
              : 'Use'}
          </button>
          <div className="secondary-btn" onClick={handleViewDetails}>
            View Details
          </div>
        </div>
      </div>

      <DialogAuthzDetails
        revoke={false}
        AddressGrants={grant?.grants}
        chainID={grant?.chainID}
        address={grant?.address}
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default GrantedToMe;
