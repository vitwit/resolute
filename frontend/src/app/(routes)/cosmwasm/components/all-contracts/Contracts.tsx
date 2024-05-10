import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getAllContractsByCode } from '@/store/features/cosmwasm/cosmwasmSlice';
import { TxStatus } from '@/types/enums';
import { CircularProgress, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import ContractsList from './ContractsList';

const Contracts = ({
  codeId,
  baseURLs,
  chainID,
  chainName,
}: {
  codeId: string;
  chainID: string;
  baseURLs: string[];
  chainName: string;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getAllContractsByCode({
        baseURLs,
        chainID,
        codeId,
      })
    );
  }, [codeId]);
  const contractsLoading = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.contracts.status
  );

  const contracts = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.contracts.data.contracts
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Tooltip title="Go back to codes" placement="bottom">
          <Image
            onClick={() => {
              router.push(`/cosmwasm/${chainName.toLowerCase()}`);
            }}
            className="cursor-pointer"
            src="/go-back-icon.svg"
            width={32}
            height={32}
            alt="Go Back"
            draggable={false}
          />
        </Tooltip>
        <div className="font-semibold text-[18px]">
          Contracts List of Code: {codeId}
        </div>
      </div>
      <div>
        {contractsLoading === TxStatus.PENDING ? (
          <div className="flex justify-center items-center h-1/2">
            <div className="flex gap-4 items-center">
              <CircularProgress size={24} sx={{ color: 'white' }} />
              <div>
                <span className="italic font-extralight">
                  Fetching Contracts
                </span>
                <span className="dots-flashing"></span>
              </div>
            </div>
          </div>
        ) : contracts?.length ? (
          <ContractsList contracts={contracts} />
        ) : (
          <div className="flex justify-center items-center h-1/2">
            <div className="text-[16px]">
              {contractsLoading === TxStatus.REJECTED ? (
                <div className="text-red-400">
                  - Failed to fetch contracts -
                </div>
              ) : (
                '- No Contracts Found -'
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Contracts;
