import React, { useEffect, useState } from 'react';
import SearchContracts from './SearchContracts';
import DeployContract from './DeployContract';
import ContractInfo from './ContractInfo';
import { useSearchParams } from 'next/navigation';
import useContracts from '@/custom-hooks/useContracts';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { setContract } from '@/store/features/cosmwasm/cosmwasmSlice';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { CircularProgress } from '@mui/material';

const Contracts = ({ chainID }: { chainID: string }) => {
  const dispatch = useAppDispatch();
  const [deployContractOpen, setDeployContractOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState({
    address: '',
    name: '',
  });
  const handleSelectContract = (address: string, name: string) => {
    setDeployContractOpen(false);
    setSelectedContract({ address, name });
  };

  const { getChainInfo } = useGetChainInfo();
  const { restURLs } = getChainInfo(chainID);

  const { getContractInfo, contractError, contractLoading } = useContracts();

  const paramsContractAddress = useSearchParams().get('contract');

  const fetchContractInfo = async () => {
    const { data } = await getContractInfo({
      address: paramsContractAddress || '',
      baseURLs: restURLs,
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
  };

  useEffect(() => {
    if (paramsContractAddress?.length) {
      fetchContractInfo();
    }
  }, [paramsContractAddress]);

  return (
    <div className="h-full flex flex-col gap-10">
      <div className="border-b-[1px] border-[#ffffff1e] pb-4 space-y-2">
        <div className="text-[18px] font-bold">CosmWasm Smart Contracts</div>
        <div className="leading-[18px] text-[12px] font-extralight">
          CosmWasm is a smart contracting platform built for the Cosmos
          ecosystem.
        </div>
      </div>
      <div>
        <div className="space-y-6">
          <SearchContracts
            chainID={chainID}
            selectedContract={selectedContract}
            handleSelectContract={handleSelectContract}
          />
          <div
            className={`text-[18px] ${deployContractOpen ? 'invisible' : 'visible'}`}
          >
            Don&apos;t have a contract? then deploy it{' '}
            <span
              onClick={() => {
                setDeployContractOpen(true);
                setSelectedContract({
                  address: '',
                  name: '',
                });
              }}
              className="font-bold underline underline-offset-[3px] cursor-pointer"
            >
              here
            </span>{' '}
          </div>
        </div>
      </div>
      {deployContractOpen && !selectedContract.address ? (
        <DeployContract chainID={chainID} />
      ) : null}
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

export default Contracts;
