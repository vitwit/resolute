import CommonCopy from '@/components/CommonCopy';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  getAllCodes,
  getAllContractsByCode,
} from '@/store/features/cosmwasm/cosmwasmSlice';
import { TxStatus } from '@/types/enums';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { shortenMsg } from '@/utils/util';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const AllContracts = (props: { chainID: string }) => {
  const { chainID } = props;
  const { getChainInfo } = useGetChainInfo();
  const { restURLs } = getChainInfo(chainID);

  const selectedCodeId = useSearchParams().get('code_id');

  return (
    <div>
      {selectedCodeId ? (
        <Contracts
          codeId={selectedCodeId}
          chainID={chainID}
          baseURLs={restURLs}
        />
      ) : (
        <Codes chainID={chainID} baseURLs={restURLs} />
      )}
    </div>
  );
};

export default AllContracts;

const Contracts = ({
  codeId,
  baseURLs,
  chainID,
}: {
  codeId: string;
  chainID: string;
  baseURLs: string[];
}) => {
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
      <div className="font-semibold text-[18px]">
        Contracts List of Code: {codeId}
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

const ContractsList = ({ contracts }: { contracts: string[] }) => {
  const tableColumnTitles = ['Contracts', 'Action'];
  return (
    <div className="codes-table">
      <table className="w-full text-sm leading-normal">
        <thead className="border-b-[0.5px] border-[#B0B0B033] relative">
          <tr className="text-left">
            {tableColumnTitles.map((title) => (
              <TableHeader key={title} title={title} />
            ))}
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <ContractItem key={contract} contract={contract} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ContractItem = ({ contract }: { contract: string }) => {
  return (
    <tr>
      <td>
        <CommonCopy
          message={contract}
          style="w-fit text-white"
          plainIcon={true}
        />
      </td>
      <td>
        <Link href={`?contract=${contract}`}>
          <button className="select-btn primary-gradient">
            Select Contract
          </button>
        </Link>
      </td>
    </tr>
  );
};

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

const CodesList = (props: { codes: CodeInfo[] }) => {
  const { codes } = props;
  const tableColumnTitle = ['Code Id', 'Code Hash', 'Creator', 'Permissions'];
  return (
    <div className="codes-table">
      <table className="w-full text-sm leading-normal">
        <thead className="border-b-[0.5px] border-[#B0B0B033] relative">
          <tr className="text-left">
            {tableColumnTitle.map((title) => (
              <TableHeader key={title} title={title} />
            ))}
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <CodeItem key={code.code_id} code={code} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CodeItem = ({ code }: { code: CodeInfo }) => {
  return (
    <tr>
      <td>{code.code_id}</td>
      <td>
        <Link
          className="hover:underline underline-offset-[3px]"
          href={`?code_id=${code.code_id}`}
        >
          {shortenMsg(code.data_hash, 25)}
        </Link>
      </td>
      <td>
        <CommonCopy
          message={code.creator}
          style="w-fit text-white"
          plainIcon={true}
        />
      </td>
      <td>
        <PermissionsData permission={code.instantiate_permission} />
      </td>
    </tr>
  );
};

const TableHeader = ({ title }: { title: string }) => {
  return (
    <th>
      <div className="min-h-[17px] flex items-center text-sm not-italic font-bold leading-[normal] text-white">
        {title}
      </div>
    </th>
  );
};

const PermissionsData = ({
  permission,
}: {
  permission: InstantiatePermission;
}) => {
  const permissionType = permission.permission;
  const [showAddresses, setShowAddresses] = useState(false);
  const handleDialogOpen = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    value: boolean
  ) => {
    setShowAddresses(value);
    e.stopPropagation();
  };
  return (
    <div>
      {permission.addresses?.length ? (
        <div className="flex gap-1 items-center">
          <div>{permissionType}</div>
          <Image
            onClick={(e) => handleDialogOpen(e, true)}
            className="cursor-pointer"
            src="/view-more-icon.svg"
            height={20}
            width={20}
            alt="View Addresses"
          />
          <DialogAddressesList
            addresses={permission.addresses}
            onClose={() => setShowAddresses(false)}
            open={showAddresses}
          />
        </div>
      ) : (
        <div>{permissionType}</div>
      )}
    </div>
  );
};

const DialogAddressesList = ({
  addresses,
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
  addresses: string[];
}) => {
  const handleDialogClose = () => {
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
            <div onClick={onClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="close"
                draggable={false}
              />
            </div>
          </div>
          <div className="px-10 space-y-4 pb-10">
            <div className="space-y-1">
              <div className="flex items-center text-white text-xl not-italic font-bold leading-[normal]">
                Allowed Addresses
              </div>
              <div className="text-[12px] font-light">
                List of addresses that are allowed to instantiate contract{' '}
              </div>
            </div>
            <div className="divider-line"></div>
            <div className="flex flex-wrap gap-4">
              {addresses.map((address) => (
                <div key={address}>
                  <CommonCopy message={address} style="" plainIcon={true} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
