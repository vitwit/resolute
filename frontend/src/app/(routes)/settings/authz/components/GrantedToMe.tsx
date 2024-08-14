import React, { useState } from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';

import { TICK_ICON } from '@/constants/image-names';
import DialogAuthzDetails from './DialogAuthzDetails';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { getMsgNameFromAuthz } from '@/utils/authorizations';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import GrantToMeLoading from './GrantToMeLoading';

const GrantedToMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  // const [dialogOpen, setDialogOpen] = useState(false);

  const { getGrantsToMe } = useAuthzGrants()

  const grants1 = getGrantsToMe(chainIDs);

  const loading = useAppSelector(
    (state) => state.authz.getGrantsByMeLoading
  );

  console.log('grants to me grants ===== ', grants1, chainIDs)


  const handleSelectCard = (index: number) => {
    setSelectedCardIndex(selectedCardIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 pt-6">
      {!!loading ? <GrantToMeLoading /> : null}

      {grants1.length && grants1.map((grant, index) => (
        <GrantToMeCard key={index} selectedCardIndex={selectedCardIndex || 0} handleSelectCard={handleSelectCard} index={index} grant={grant} />
      )) || <>
          <div>No grants to you</div>
        </>}
    </div>
  );
};

const GrantToMeCard = ({ index, grant, handleSelectCard, selectedCardIndex }: {
  index: number,
  handleSelectCard: (index: number) => void;
  selectedCardIndex: number;
  grant: AddressGrants
}) => {
  // const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
  //   null
  // );

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = () => {
    setDialogOpen(true);
  };

  const { getChainInfo } = useGetChainInfo();
  const { chainLogo } = getChainInfo(grant?.chainID);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div
      className={`grants-card justify-between items-start w-full gap-16 ${selectedCardIndex === index ? 'selected-grants-card' : ''
        }`}
      key={index}
    >
      <div className="flex flex-col gap-2 w-[280px]">
        <div className="flex gap-2 items-center">
          <p className="text-b1-light">Address</p>
          {selectedCardIndex === index && (
            <div className="flex space-x-0">
              <Image
                src={TICK_ICON}
                width={16}
                height={16}
                alt="used-icon"
              />
              <span className="text-[#2BA472]">Currently Using</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center h-8">
          <p className="truncate text-b1">{grant.address}</p>
          <Copy content={grant.address} />
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-b1-light">Permissions</p>
        <div className="flex gap-2 flex-wrap">
          {grant?.grants?.map((g, idx) => (
            <div
              className="permission-card flex gap-2 items-center"
              key={idx}
            >
              <p className="text-b1">{
                getMsgNameFromAuthz(g)
              }</p>
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
              selectedCardIndex === index ? 'cancel-btn' : 'primary-btn'
            }
            onClick={() => handleSelectCard(index)}
          >
            {selectedCardIndex === index ? 'Cancel' : 'Use'}
          </button>
          <div className="secondary-btn"
            onClick={handleViewDetails}
          >
            View Details
          </div>
        </div>
      </div>

      <DialogAuthzDetails AddressGrants={grant?.grants} chainID={grant?.chainID} address={grant?.address} open={dialogOpen} onClose={handleCloseDialog} />
    </div>
  )
}

export default GrantedToMe;
