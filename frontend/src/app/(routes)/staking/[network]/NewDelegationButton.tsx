import CustomButton from '@/components/common/CustomButton';
import { ValidatorInfo } from '@/types/staking';
import React, { useEffect, useState } from 'react';
import NewDelegationDialog from '../components/NewDelegationDialog';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { useRouter, useSearchParams } from 'next/navigation';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useValidators from '@/custom-hooks/staking/useValidators';
import { TxStatus } from '@/types/enums';

const NewDelegationButton = ({ chainID }: { chainID: string }) => {
  const router = useRouter();
  const paramAction = useSearchParams().get('action');
  const paramValidator = useSearchParams().get('validator_address');
  const { getValidatorInfoByAddress } = useValidators();

  const { getChainInfo } = useGetChainInfo();
  const { chainName } = getChainInfo(chainID);
  const [selectedValidator, setSelectedValidator] =
    useState<ValidatorInfo | null>(null);
  const [newDelegationOpen, setNewDelegationOpen] = useState(false);

  const validatorsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.validators.status
  );

  const handleValidatorChange = (option: ValidatorInfo | null) => {
    setSelectedValidator(option);
    if (option?.address) {
      router.push(`?validator_address=${option.address}&action=new_delegation`);
    } else {
      router.push(`?action=new_delegation`);
    }
  };

  const handleCloseNewDelegation = () => {
    setNewDelegationOpen(false);
    setSelectedValidator(null);
    router.push(`/staking/${chainName.toLowerCase()}`);
  };

  const handleOpenNewDelegation = () => {
    setNewDelegationOpen(true);
  };

  useEffect(() => {
    if (paramAction === 'new_delegation') {
      handleOpenNewDelegation();
      if (validatorsLoading === TxStatus.IDLE) {
        if (paramValidator?.length) {
          const validatorInfo = getValidatorInfoByAddress({
            chainID,
            address: paramValidator,
          });
          if (validatorInfo) {
            setSelectedValidator(validatorInfo);
          } else {
            router.push(`?action=new_delegation`);
          }
        }
      }
    }
  }, [paramAction, validatorsLoading]);

  return (
    <>
      <CustomButton
        btnText="New Delegation"
        btnOnClick={() => {
          handleOpenNewDelegation();
          router.push(`?action=new_delegation`);
        }}
      />
      <NewDelegationDialog
        chainID={chainID}
        onClose={handleCloseNewDelegation}
        open={newDelegationOpen}
        selectedValidator={selectedValidator}
        handleValidatorChange={handleValidatorChange}
      />
    </>
  );
};

export default NewDelegationButton;
