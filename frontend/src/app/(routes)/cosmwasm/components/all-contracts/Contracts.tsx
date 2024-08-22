import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getAllContractsByCode } from '@/store/features/cosmwasm/cosmwasmSlice';
import { TxStatus } from '@/types/enums';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import ContractsList from './ContractsList';
import PageHeader from '@/components/common/PageHeader';

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
    <div className="space-y-10">
      <div className="space-y-6">
        <button
          onClick={() => {
            router.push(`/cosmwasm/${chainName.toLowerCase()}?tab=codes`);
          }}
          className="text-btn flex items-center w-fit"
        >
          <span>Back to codes</span>
        </button>
        <PageHeader
          title={`Code ${codeId}`}
          description={`Contracts list of code ${codeId}`}
        />
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
