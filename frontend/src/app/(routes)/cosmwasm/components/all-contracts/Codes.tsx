import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getAllCodes } from '@/store/features/cosmwasm/cosmwasmSlice';
import { TxStatus } from '@/types/enums';
import React, { useEffect } from 'react';
import CodesList from './CodesList';
import PageHeader from '@/components/common/PageHeader';
import CodesLoading from '../loaders/CodesLoading';

const Codes = ({
  chainID,
  baseURLs,
}: {
  chainID: string;
  baseURLs: string[];
}) => {
  const dispatch = useAppDispatch();
  const codesLoading = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.codes.status
  );

  const codes = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.codes.data.codes
  );

  useEffect(() => {
    dispatch(getAllCodes({ baseURLs, chainID }));
  }, []);

  return (
    <div className="space-y-10">
      <PageHeader title="Codes" description="List of codes" />
      <div className="px-6">
        {codesLoading === TxStatus.PENDING ? (
          <CodesLoading />
        ) : codes?.length ? (
          <CodesList codes={codes} chainID={chainID} />
        ) : (
          <div className="flex justify-center items-center h-1/2">
            <div className="text-[16px]">
              {codesLoading === TxStatus.REJECTED ? (
                <div className="text-red-400">- Failed to fetch codes -</div>
              ) : (
                '- No Codes Found -'
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Codes;
