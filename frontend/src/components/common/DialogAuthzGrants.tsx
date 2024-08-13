import React, { useState } from 'react';
import CustomDialog from './CustomDialog';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { Tooltip } from '@mui/material';
import { capitalizeFirstLetter, convertToSpacedName } from '@/utils/util';
import Image from 'next/image';
import { DROP_DOWN_ICON_FILLED } from '@/constants/image-names';
import { enableAuthzMode } from '@/store/features/authz/authzSlice';
import { setAuthzMode } from '@/utils/localStorage';
import useAuthzGrants, { ChainAuthz } from '@/custom-hooks/useAuthzGrants';
import useInitAuthz from '@/custom-hooks/useInitAuthz';
import { exitFeegrantMode } from '@/store/features/feegrant/feegrantSlice';
import { getMsgNameFromAuthz } from '@/utils/authorizations';

interface DialogAuthzGrantsProps {
  open: boolean;
  onClose: () => void;
}

const DialogAuthzGrants: React.FC<DialogAuthzGrantsProps> = (props) => {
  const { open, onClose } = props;
  const dispatch = useAppDispatch();
  const { getCosmosAddress } = useGetChainInfo();
  const cosmosAddress = getCosmosAddress();

  const [viewMore, setViewMore] = useState(false);
  const [viewingGrant, setViewingGrant] = useState('');
  const grantsToMeLoading = useAppSelector(
    (state) => state.authz.getGrantsToMeLoading > 0
  );

  const { getInterChainGrants } = useAuthzGrants();
  const grants = getInterChainGrants();

  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );
  useInitAuthz({ chainIDs });

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="Select Authz Granter"
      description="Your authz permissions"
      showDivider={true}
    >
      <div className="w-[800px] space-y-10">
        {!grantsToMeLoading && !grants.length ? (
          <div className="flex gap-1 items-center justify-center my-6">
            <p>- No permissions found -</p>
          </div>
        ) : null}

        {grants.map((grant) => (
          <div
            key={grant.cosmosAddress}
            className="bg-[#FFFFFF05] rounded-2xl p-6 space-y-6 w-full"
          >
            <div className="flex justify-between items-center">
              <div className="font-medium">{grant.cosmosAddress}</div>
              <div className="flex gap-4 items-center justify-between">
                <button
                  onClick={() => {
                    dispatch(enableAuthzMode({ address: grant.cosmosAddress }));
                    dispatch(exitFeegrantMode());
                    setAuthzMode(cosmosAddress, grant.address);
                    onClose();
                  }}
                  className="btn-border-primary h-6 text-[14px] px-6 py-[10.5px] rounded-full flex items-center"
                >
                  Use Account
                </button>
                <button
                  className="hover:bg-[#ffffff11] rounded-full"
                  onClick={() => {
                    if (viewMore && grant.cosmosAddress === viewingGrant) {
                      setViewMore(false);
                      setViewingGrant('');
                    } else {
                      setViewMore(true);
                      setViewingGrant(grant.cosmosAddress);
                    }
                  }}
                >
                  <Image
                    className={
                      viewMore && viewingGrant === grant.cosmosAddress
                        ? ''
                        : 'rotate-180'
                    }
                    src={DROP_DOWN_ICON_FILLED}
                    height={24}
                    width={24}
                    alt=""
                  />
                </button>
              </div>
            </div>
            {viewMore && viewingGrant === grant.cosmosAddress ? (
              <AuthzGrants grants={grant.grants} />
            ) : null}
          </div>
        ))}

        {grantsToMeLoading ? (
          <div className="flex gap-1 items-center justify-center my-6 text-[14px] italic">
            <p>
              Please wait, trying to fetch your permissions
              <span className="dots-loader"></span>
            </p>
          </div>
        ) : null}
      </div>
    </CustomDialog>
  );
};

export default DialogAuthzGrants;

const AuthzGrants = ({ grants }: { grants: ChainAuthz[] }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-[#FFFFFF80] text-[14px]">Allowed Messages</h3>
      <div className="flex flex-wrap gap-4">
        {grants.map((chainGrants) => (
          <ChainGrants key={chainGrants.chainID} chainAuthz={chainGrants} />
        ))}
      </div>
    </div>
  );
};

const ChainGrants = ({ chainAuthz }: { chainAuthz: ChainAuthz }) => {
  const { chainID, grant } = chainAuthz;
  const mgsName = getMsgNameFromAuthz(grant);
  const { getChainInfo } = useGetChainInfo();
  const { chainLogo, chainName } = getChainInfo(chainID);

  return (
    <div className="flex gap-6 flex-wrap">
      <div className="rounded-xl p-2 bg-[#FFFFFF05] flex gap-2 items-center">
        <Tooltip title={capitalizeFirstLetter(chainName)} placement="top">
          <Image
            className="rounded-full"
            src={chainLogo}
            width={16}
            height={16}
            alt={chainID}
          />
        </Tooltip>
        <div>{convertToSpacedName(mgsName)}</div>
      </div>
    </div>
  );
};
