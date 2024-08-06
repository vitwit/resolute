import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { ALLOWED_MSG_ALLOWANCE } from '@/utils/feegrant';
import { get } from 'lodash';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { convertToSpacedName, shortenAddress } from '@/utils/util';
import { getTypeURLName } from '@/utils/authorizations';
import CustomButton from '@/components/common/CustomButton';
import { TxStatus } from '@/types/enums';
import { txRevoke } from '@/store/features/feegrant/feegrantSlice';
import DialogFeegrantDetails from './DialogFeegrantDetails';

interface GrantByMeCardProps {
  chainID: string;
  address: string;
  grant: Allowance;
}

const GrantByMeCard: React.FC<GrantByMeCardProps> = ({ chainID, address, grant }) => {
  const dispatch = useAppDispatch();
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedGrantee, setSelectedGrantee] = useState('');
  
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { chainLogo, chainName } = getChainInfo(chainID);
  const { minimalDenom } = getDenomInfo(chainID);

  const txRevokeStatus = useAppSelector((state) => state.feegrant.chains[chainID].tx.status);
  const txRevokeLoading = txRevokeStatus === TxStatus.PENDING && address === selectedGrantee;

  const { allowance } = grant;
  const allowedMsgs = get(allowance, '@type') === ALLOWED_MSG_ALLOWANCE 
    ? get(allowance, 'allowed_messages', []) 
    : [];

  useEffect(() => {
    if (txRevokeStatus !== TxStatus.PENDING) {
      setSelectedGrantee('');
    }
  }, [txRevokeStatus]);

  const handleRevokeFeegrant = () => {
    setSelectedGrantee(grant.grantee);
    dispatch(
      txRevoke({
        granter: grant.granter,
        grantee: grant.grantee,
        basicChainInfo: getChainInfo(chainID),
        baseURLs: getChainInfo(chainID).restURLs,
        feegranter: '',
        denom: minimalDenom,
      })
    );
  };

  const toggleViewDetails = () => {
    setViewDetailsOpen((prev) => !prev);
  };

  const renderAllowedMessages = () => {
    if (allowedMsgs.length > 0) {
      return allowedMsgs.map((message) => (
        <div className="permission-card flex gap-2 items-center" key={message}>
          <p className="text-b1">{convertToSpacedName(getTypeURLName(message))}</p>
        </div>
      ));
    }
    
    return (
      <div className="permission-card">
        <p className="text-b1">All</p>
      </div>
    );
  };

  return (
    <div className="grants-card justify-between gap-16 items-start w-full">
      <div className="flex flex-col gap-2 w-[216px]">
        <div className="flex gap-2 items-center">
          <Image src={chainLogo} width={20} height={20} alt="network-logo" />
          <p className="text-b1-light capitalize">{chainName}</p>
        </div>
        <div className="flex gap-2 items-center h-8">
          <p className="truncate text-b1">{shortenAddress(address, 24)}</p>
          <Copy content={address} />
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-b1-light">Allowed Messages</p>
        <div className="flex gap-2 flex-wrap">
          {renderAllowedMessages()}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-[21px]" />
        <div className="flex gap-6 items-center">
          <CustomButton
            btnText="Revoke"
            btnOnClick={handleRevokeFeegrant}
            btnDisabled={txRevokeStatus === TxStatus.PENDING}
            btnLoading={txRevokeLoading}
            btnStyles="w-[114px]"
          />
          <div className="secondary-btn" onClick={toggleViewDetails}>
            View Details
          </div>
        </div>
      </div>
      <DialogFeegrantDetails
        open={viewDetailsOpen}
        onClose={toggleViewDetails}
        chainID={chainID}
        grant={allowance}
      />
    </div>
  );
};

export default GrantByMeCard;
