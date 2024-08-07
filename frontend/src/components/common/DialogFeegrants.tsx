import useFeeGrants, { ChainAllowance } from '@/custom-hooks/useFeeGrants';
import React, { useState } from 'react';
import CustomDialog from './CustomDialog';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useInitFeegrant from '@/custom-hooks/useInitFeegrant';
import { getMsgNamesFromAllowance } from '@/utils/feegrant';
import { Tooltip } from '@mui/material';
import { capitalizeFirstLetter, convertToSpacedName } from '@/utils/util';
import Image from 'next/image';
import { DROP_DOWN_ICON_FILLED } from '@/constants/image-names';
import { enableFeegrantMode } from '@/store/features/feegrant/feegrantSlice';
import { exitAuthzMode } from '@/store/features/authz/authzSlice';
import { setFeegrantMode } from '@/utils/localStorage';

interface DialogFeegrantsProps {
  open: boolean;
  onClose: () => void;
}

const DialogFeegrants: React.FC<DialogFeegrantsProps> = (props) => {
  const { open, onClose } = props;
  const dispatch = useAppDispatch();
  const { getCosmosAddress } = useGetChainInfo();
  const cosmosAddress = getCosmosAddress();

  const [viewMore, setViewMore] = useState(false);
  const grantsToMeLoading = useAppSelector(
    (state) => state.feegrant.getGrantsToMeLoading > 0
  );

  const { getInterChainGrants } = useFeeGrants();
  const grants = getInterChainGrants();

  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );
  useInitFeegrant({ chainIDs });

  const toggleViewMore = () => {
    setViewMore((prev) => !prev);
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="Select Feegranter"
      description="Transaction fee will be deducted from the selected feegrant"
      showDivider={true}
    >
      <div className="w-[800px]">
        {!grantsToMeLoading && !grants.length ? (
          <div className="flex gap-1 items-center justify-center my-6">
            <p>- No allowances found -</p>
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
                    dispatch(
                      enableFeegrantMode({ address: grant.cosmosAddress })
                    );
                    dispatch(exitAuthzMode());
                    setFeegrantMode(cosmosAddress, grant.address);
                    onClose();
                  }}
                  className="btn-border-primary h-6 text-[14px] px-6 py-[10.5px] rounded-full flex items-center"
                >
                  Use Account
                </button>
                <button
                  className="hover:bg-[#ffffff11] rounded-full"
                  onClick={toggleViewMore}
                >
                  <Image
                    className={viewMore ? '' : 'rotate-180'}
                    src={DROP_DOWN_ICON_FILLED}
                    height={24}
                    width={24}
                    alt=""
                  />
                </button>
              </div>
            </div>
            {viewMore ? <FeegrantAllowances grants={grant.grants} /> : null}
          </div>
        ))}

        {grantsToMeLoading ? (
          <div className="flex gap-1 items-center justify-center my-6 text-[14px] italic">
            <p>
              Please wait, trying to fetch your allowances
              <span className="dots-loader"></span>
            </p>
          </div>
        ) : null}
      </div>
    </CustomDialog>
  );
};

export default DialogFeegrants;

const FeegrantAllowances = ({ grants }: { grants: ChainAllowance[] }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-[#FFFFFF80] text-[14px]">Allowed Messages</h3>
      <div className="flex flex-wrap gap-4">
        {grants.map((chainGrants) => (
          <ChainGrants key={chainGrants.chainID} chainAllowance={chainGrants} />
        ))}
      </div>
    </div>
  );
};

const ChainGrants = ({
  chainAllowance,
}: {
  chainAllowance: ChainAllowance;
}) => {
  const { chainID, grant } = chainAllowance;
  const mgsNames = getMsgNamesFromAllowance(grant);
  const { getChainInfo } = useGetChainInfo();
  const { chainLogo, chainName } = getChainInfo(chainID);

  return (
    <div className="flex gap-6 flex-wrap">
      {mgsNames.map((msg) => (
        <div
          key={msg}
          className="rounded-xl p-2 bg-[#FFFFFF05] flex gap-2 items-center"
        >
          <Tooltip title={capitalizeFirstLetter(chainName)} placement="top">
            <Image
              className="rounded-full"
              src={chainLogo}
              width={16}
              height={16}
              alt={chainID}
            />
          </Tooltip>
          <div>{convertToSpacedName(msg)}</div>
        </div>
      ))}
    </div>
  );
};
