import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';

import DialogRevokeAll from '../../components/DialogRevokeAll';
import DialogConfirmDelete from '@/components/common/DialogConfirmDelete';
import DialogAuthzDetails from './DialogAuthzDetails';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  getMsgNameFromAuthz,
  getTypeURLFromAuthorization,
} from '@/utils/authorizations';
import GrantByMeLoading from './GrantByMeLoading';
import useGetAuthzRevokeMsgs from '@/custom-hooks/useGetAuthzRevokeMsgs';
import { txAuthzRevoke } from '@/store/features/authz/authzSlice';
import { TxStatus } from '@/types/enums';
import { RootState } from '@/store/store';
import { groupBy } from 'lodash';
import { shortenAddress } from '@/utils/util';

const GrantedByMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(
    null
  );

  const { convertToCosmosAddress } = useGetChainInfo();
  const { getGrantsByMe } = useAuthzGrants();

  const authzGrants = getGrantsByMe(chainIDs);
   /* eslint-disable @typescript-eslint/no-explicit-any */
  let grantsList: any[] = [];
  authzGrants.forEach((grant) => {
    const data = {
      ...grant,
      cosmosAddress: convertToCosmosAddress(grant.address),
    };
    grantsList = [...grantsList, data];
  });
  const groupedGrants = groupBy(grantsList, 'cosmosAddress');

  const loading = useAppSelector((state) => state.authz.getGrantsByMeLoading);

  const handleCloseRevokeDialog = () => {
    setRevokeDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPermission(null);
  };

  const handleDelete = () => {
    console.log('Delete permission:', selectedPermission);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6 pt-6">
      {Object.entries(groupedGrants).map(([granterKey, grants]) => (
        <div
          className="border-[1px] border-[#565656] rounded-2xl"
          key={granterKey}
        >
          {grants.map((g, index) => (
            <AuthzGrant
              key={index}
              chainID={g?.chainID}
              address={g?.address}
              grants={g?.grants}
            />
          ))}
        </div>
      ))}
      {!!loading ? (
        <GrantByMeLoading />
      ) : (
        <>
          {!authzGrants?.length && (
            <>
              <div>No grants by you</div>
            </>
          )}
        </>
      )}

      <DialogRevokeAll
        open={revokeDialogOpen}
        onClose={handleCloseRevokeDialog}
      />

      <DialogConfirmDelete
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDelete}
        title="Confirm Delete"
        description={`Are you sure you want to delete the permission "${selectedPermission}"?`}
        loading={false}
      />
    </div>
  );
};

interface SelectPermission {
  granter: string;
  grantee: string;
  typeUrl: string;
}

const AuthzGrant: React.FC<AddressGrants> = ({ chainID, address, grants }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRevoke, setIsRevoke] = useState(false);

  const { getChainInfo } = useGetChainInfo();
  const { chainLogo, chainName } = getChainInfo(chainID);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setIsRevoke(false);
  };

  const handleRevokeAll = () => {
    setIsRevoke(true);
    setDialogOpen(true);
  };

  const handleViewDetails = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <DialogAuthzDetails
        revoke={isRevoke}
        address={address}
        chainID={chainID}
        AddressGrants={grants}
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
      <div
        className="grants-card justify-between gap-16 w-full items-start"
        key={chainID}
      >
        <div className="flex flex-col gap-2 w-[280px]">
          <div className="flex gap-2 items-center">
            <Image src={chainLogo} width={20} height={20} alt="network-logo" />
            <p className="text-b1-light capitalize">{chainName}</p>
          </div>
          <div className="flex gap-2 items-center h-8">
            <p className="truncate text-b1">{shortenAddress(address, 30)}</p>
            <Copy content={address} />
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-b1-light">Permissions</p>
          <div className="flex gap-2 flex-wrap">
            {grants.map((g, idx) => (
              <GrantCard key={idx} chainID={chainID} idx={idx} g={g} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-[21px]" />
          <div className="flex gap-6 items-center">
            <button className="primary-btn" onClick={handleRevokeAll}>
              Revoke All
            </button>
            <div className="secondary-btn" onClick={handleViewDetails}>
              View Details
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const GrantCard = ({
  idx,
  g,
  chainID,
}: {
  idx: number;
  g: Authorization;
  chainID: string;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string>();
  const [selectPermission, setSelectPermission] =
    useState<SelectPermission | null>(null);

  const handleDeletePermission = (permission: string) => {
    setSelectedPermission(permission);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const { txRevokeAuthzInputs } = useGetAuthzRevokeMsgs({
    granter: selectPermission?.granter || '',
    grantee: selectPermission?.grantee || '',
    chainID,
    typeURLs: [selectPermission?.typeUrl || ''],
  });

  const dispatch = useAppDispatch();

  const { basicChainInfo, denom, feeAmount, feegranter, msgs } =
    txRevokeAuthzInputs;

  const loading = useAppSelector(
    (state: RootState) => state.authz.chains?.[chainID].tx.status
  );

  useEffect(() => {
    if (loading === TxStatus.IDLE) {
      setDeleteDialogOpen(false);
    }
  }, [loading]);

  const handleDelete = () => {
    dispatch(
      txAuthzRevoke({
        basicChainInfo,
        denom,
        feeAmount,
        feegranter,
        msgs,
      })
    );
  };

  return (
    <div className="permission-card" key={idx}>
      <DialogConfirmDelete
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDelete}
        title="Confirm Delete"
        description={`Are you sure you want to delete the permission "${selectedPermission}"?`}
        loading={loading === TxStatus.PENDING}
      />

      <div className="flex space-x-2 items-center">
        <p className="text-b1">{getMsgNameFromAuthz(g)}</p>
        <Image
          src="/delete.svg"
          width={16}
          height={16}
          alt="delete-icon"
          onClick={() => {
            handleDeletePermission(getMsgNameFromAuthz(g));
            setSelectPermission({
              granter: g.granter,
              grantee: g.grantee,
              typeUrl: getTypeURLFromAuthorization(g),
            });
          }}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default GrantedByMe;
