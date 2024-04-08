import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent, Tooltip } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useFeeGrants, {
  ChainAllowance,
  InterChainFeegrants,
} from '@/custom-hooks/useFeeGrants';
import { enableFeegrantMode } from '@/store/features/feegrant/feegrantSlice';
import { setFeegrantMode } from '@/utils/localStorage';
import { getMsgNamesFromAllowance } from '@/utils/feegrant';
import { capitalizeFirstLetter } from '@/utils/util';
import { exitAuthzMode } from '@/store/features/authz/authzSlice';
import useInitFeegrant from '@/custom-hooks/useInitFeegrant';

interface DialogFeegrantsProps {
  open: boolean;
  onClose: () => void;
  grants: InterChainFeegrants[];
}

const DialogFeegrants: React.FC<DialogFeegrantsProps> = (props) => {
  const {
    open,
    onClose,
    // grants
  } = props;
  const dispatch = useAppDispatch();
  const { getCosmosAddress } = useGetChainInfo();
  const cosmosAddress = getCosmosAddress();

  const grantsToMeLoading = useAppSelector(
    (state) => state.feegrant.getGrantsToMeLoading > 0
  );

  const { getInterChainGrants } = useFeeGrants();
  const grants = getInterChainGrants();

  const networks = useAppSelector((state) => state.wallet.networks);
  const chainIDs = Object.keys(networks);
  useInitFeegrant({ chainIDs });

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

            {!grantsToMeLoading && !grants.length ? (
              <div className="flex gap-1 items-center justify-center my-6">
                <p>- No allowances found -</p>
              </div>
            ) : null}

            {grants.map((grant) => (
              <div className="grants-card" key={grant.address}>
                <AddressChip address={grant.cosmosAddress} />
                <FeegrantAllowances grants={grant.grants} />
                <button
                  className="use-grant-btn"
                  onClick={() => {
                    dispatch(
                      enableFeegrantMode({ address: grant.cosmosAddress })
                    );
                    dispatch(exitAuthzMode());
                    setFeegrantMode(cosmosAddress, grant.address);
                    onClose();
                  }}
                >
                  Use
                </button>
              </div>
            ))}

            {grantsToMeLoading ? (
              <div className="flex gap-1 items-center justify-center my-6">
                <p>
                  Please wait, trying to fetch your allowances
                  <span className="dots-loader"></span>
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogFeegrants;

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

const FeegrantAllowances = ({ grants }: { grants: ChainAllowance[] }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-[#FFFFFF80] text-[14px]">Permissions</h3>
      <div className="flex flex-wrap gap-4">
        {grants.map((chainGrants) => (
          <ChainFeegrants
            key={chainGrants.chainID}
            chainAllowance={chainGrants}
          />
        ))}
      </div>
    </div>
  );
};

const ChainFeegrants = ({
  chainAllowance,
}: {
  chainAllowance: ChainAllowance;
}) => {
  const { chainID, grant } = chainAllowance;
  const mgsNames = getMsgNamesFromAllowance(grant);
  const { getChainInfo } = useGetChainInfo();
  const { chainLogo, chainName } = getChainInfo(chainID);

  return (
    <>
      {mgsNames.map((msg) => (
        <div
          key={msg}
          className="rounded-xl p-2 bg-[#FFFFFF1A] flex gap-2 items-center max-h-8"
        >
          <div>{msg}</div>
          <Tooltip title={capitalizeFirstLetter(chainName)} placement="top">
            <Image
              className="rounded-full"
              src={chainLogo}
              width={16}
              height={16}
              alt={chainID}
            />
          </Tooltip>
        </div>
      ))}
    </>
  );
};
