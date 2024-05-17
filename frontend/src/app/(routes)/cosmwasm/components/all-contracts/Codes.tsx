import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getAllCodes } from '@/store/features/cosmwasm/cosmwasmSlice';
import { TxStatus } from '@/types/enums';
import { CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import CodesList from './CodesList';

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
    <div className="">
      {codesLoading === TxStatus.PENDING ? (
        <div className="flex justify-center items-center h-1/2">
          <div className="flex gap-4 items-center">
            <CircularProgress size={24} sx={{ color: 'white' }} />
            <div>
              <span className="italic font-extralight">Fetching Codes</span>
              <span className="dots-flashing"></span>
            </div>
          </div>
        </div>
      ) : codes?.length ? (
        <CodesList codes={codes} />
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
  );
};

export default Codes;
