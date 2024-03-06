import useAuthzGrants, {
  ChainAuthz,
  InterChainAuthzGrants,
} from '@/custom-hooks/useAuthzGrants';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getMsgNameFromAuthz } from '@/utils/authorizations';
import { enableAuthzMode } from '@/store/features/authz/authzSlice';
import {  setAuthzMode } from '@/utils/localStorage';
import { exitFeegrantMode } from '@/store/features/feegrant/feegrantSlice';
import useInitAuthz from '@/custom-hooks/useInitAuthz';

interface DialogAuthzGrantsProps {
  open: boolean;
  onClose: () => void;
  grants: InterChainAuthzGrants[];
}

const DialogAuthzGrants: React.FC<DialogAuthzGrantsProps> = (props) => {

  const { open, onClose,
    // grants
  } = props;
  const dispatch = useAppDispatch();
  const { getCosmosAddress } = useGetChainInfo();
  const cosmosAddress = getCosmosAddress();

  const grantsToMeLoading = useAppSelector(
    (state) => state.authz.getGrantsToMeLoading > 0
  );

  const { getInterChainGrants } = useAuthzGrants();
  const grants = getInterChainGrants();

  useInitAuthz();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
            <div onClick={onClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
                draggable={false}
              />
            </div>
          </div>
          <div className="mb-[72px] px-10">
            <h2 className="text-[20px] font-bold">Select Granter</h2>

            {
              grantsToMeLoading ? <p>Please wait trying to fetch your grants......</p> : null
            }


            {
              !grantsToMeLoading && !grants.length
                ? 'No authz permissions found' : null
            }

            {grants.map((grant) => (
              <div className="grants-card" key={grant.address}>
                <AddressChip address={grant.cosmosAddress} />
                <AuthzPermissions grants={grant.grants} />
                <button
                  className="use-grant-btn"
                  onClick={() => {
                    dispatch(enableAuthzMode({ address: grant.cosmosAddress }));
                    dispatch(exitFeegrantMode());
                    setAuthzMode(cosmosAddress, grant.address);
                    onClose();
                  }}
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAuthzGrants;

export const AddressChip = ({ address }: { address: string }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="common-copy text-[16px] font-bold max-w-fit">
      <span className="truncate">{address}</span>
      <Image
        className="cursor-pointer"
        onClick={(e) => {
          copyToClipboard(address);
          dispatch(
            setError({
              type: 'success',
              message: 'Copied',
            })
          );
          e.stopPropagation();
        }}
        src="/copy-icon-plain.svg"
        width={24}
        height={24}
        alt="copy"
      />
    </div>
  );
};

const AuthzPermissions = ({ grants }: { grants: ChainAuthz[] }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-[#FFFFFF80] text-[14px]">Permissions</h3>
      <div className="flex flex-wrap gap-4">
        {grants.map((grant, index) => (
          <Message
            key={index}
            chainID={grant.chainID}
            msg={getMsgNameFromAuthz(grant.grant)}
          />
        ))}
      </div>
    </div>
  );
};

const Message = ({ msg, chainID }: { msg: string; chainID: string }) => {
  const { getChainInfo } = useGetChainInfo();
  const { chainLogo } = getChainInfo(chainID);

  return (
    <div className="rounded-xl p-2 bg-[#FFFFFF1A] flex gap-2 items-center max-h-8">
      <div>{msg}</div>
      <Image
        className="rounded-full"
        src={chainLogo}
        width={16}
        height={16}
        alt={chainID}
      />
    </div>
  );
};
