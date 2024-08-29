import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useContracts from '@/custom-hooks/useContracts';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { setContract } from '@/store/features/cosmwasm/cosmwasmSlice';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { CircularProgress } from '@mui/material';
import ContractInfo from './ContractInfo';
import SearchContract from './SearchContract';
import Link from 'next/link';

const Contract = ({ chainID }: { chainID: string }) => {
  const dispatch = useAppDispatch();
  const [selectedContract, setSelectedContract] = useState({
    address: '',
    name: '',
  });
  const handleSelectContract = (address: string, name: string) => {
    setSelectedContract({ address, name });
  };

  const { getChainInfo } = useGetChainInfo();
  const { restURLs, chainName } = getChainInfo(chainID);

  const { getContractInfo, contractError, contractLoading } = useContracts();

  const paramsContractAddress = useSearchParams().get('contract');

  const fetchContractInfo = async () => {
    try {
      const { data } = await getContractInfo({
        address: paramsContractAddress || '',
        baseURLs: restURLs,
        chainID,
      });
      if (data) {
        dispatch(
          setContract({
            chainID,
            contractAddress: data?.address,
            contractInfo: data?.contract_info,
          })
        );
        setSelectedContract({
          address: data?.address,
          name: data?.contract_info?.label,
        });
      }
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (paramsContractAddress?.length) {
      fetchContractInfo();
    }
  }, [paramsContractAddress]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <div className={`text-b1-light justify-end flex mb-2`}>
          Don&apos;t have a contract? then deploy it
          <Link
            href={`/cosmwasm/${chainName.toLowerCase()}?tab=deploy`}
            className="!font-bold text-b1 underline underline-offset-[3px] cursor-pointer ml-1"
          >
            here
          </Link>
        </div>
        <div className="space-y-6">
          <SearchContract
            chainID={chainID}
            selectedContract={selectedContract}
            handleSelectContract={handleSelectContract}
          />
        </div>
      </div>
      {contractLoading ? (
        <div className="flex-center-center gap-2">
          <CircularProgress sx={{ color: 'white' }} size={18} />
          <div className="italic font-extralight text-[14px]">
            Fetching contract info <span className="dots-flashing"></span>
          </div>
        </div>
      ) : contractError ? (
        <div className="text-red-300 text-center py-6">{contractError}</div>
      ) : null}
      {selectedContract.address ? <ContractInfo chainID={chainID} /> : null}
    </div>
  );
};

export default Contract;
