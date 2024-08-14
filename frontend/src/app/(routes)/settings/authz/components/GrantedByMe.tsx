import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';

import DialogRevokeAll from '../../components/DialogRevokeAll';
import DialogConfirmDelete from '@/components/common/DialogConfirmDelete';
import DialogAuthzDetails from './DialogAuthzDetails';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getMsgNameFromAuthz, getTypeURLFromAuthorization } from '@/utils/authorizations';
import GrantByMeLoading from './GrantByMeLoading';
import useGetAuthzRevokeMsgs from '@/custom-hooks/useGetAuthzRevokeMsgs';
import { txAuthzRevoke } from '@/store/features/authz/authzSlice';
import { TxStatus } from '@/types/enums';
import { RootState } from '@/store/store';

const GrantedByMe = ({ chainIDs }: { chainIDs: string[] }) => {
  // const [dialogOpen, setDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(
    null
  );

  const { getGrantsByMe } = useAuthzGrants()

  const grants1 = getGrantsByMe(chainIDs);

  const loading = useAppSelector(
    (state) => state.authz.getGrantsByMeLoading
  );

  // const handleViewDetails = () => {
  //   setDialogOpen(true);
  // };

  // const handleCloseDialog = () => {
  //   setDialogOpen(false);
  // };



  const handleCloseRevokeDialog = () => {
    setRevokeDialogOpen(false);
  };

  // const handleDeletePermission = (permission: string) => {
  //   setSelectedPermission(permission);
  //   setDeleteDialogOpen(true);
  // };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPermission(null);
  };

  const handleDelete = () => {
    console.log('Delete permission:', selectedPermission);
    setDeleteDialogOpen(false);
  };

  // const grants: Grant[] = [
  //   {
  //     address: 'pasg1y0hvu8ts6m87yltguyufwf',
  //     permissions: ['send', 'Delegate', 'vote', 'send'],
  //   },
  //   {
  //     address: 'pasg1xy2a8ts6m87yltguyufwf',
  //     permissions: ['send', 'Delegate', 'vote', 'send'],
  //   },
  //   {
  //     address: 'pasg1y0hvu8ts6m87yltguyufwf',
  //     permissions: [
  //       'send',
  //       'Delegate',
  //       'vote',
  //       'send',
  //       'send',
  //       'Delegate',
  //       'vote',
  //       'send',
  //     ],
  //   },
  //   {
  //     address: 'pasg1xy2a8ts6m87yltguyufwf',
  //     permissions: ['send', 'Delegate', 'vote', 'send'],
  //   },
  // ];



  return (
    <div className="space-y-6 pt-6">
      {!!loading ? <GrantByMeLoading /> : null}

      {
        grants1.length && grants1?.map((g, ig) => (
          <AuthzGrant key={ig} chainID={g?.chainID} address={g?.address} grants={g?.grants} />
        )) || <>
          <div>No grants by you</div>
        </>
      }
      {/* {grants.map((grant, index) => (
        // <div
        //   className="grants-card justify-between gap-16 w-full items-start"
        //   key={index}
        // >
        //   <div className="flex flex-col gap-2 w-[280px]">
        //     <div className="flex gap-2 items-center">
        //       <Image
        //         src="/akash.png"
        //         width={20}
        //         height={20}
        //         alt="network-logo"
        //       />
        //       <p className="text-b1-light capitalize">Akash</p>
        //     </div>
        //     <div className="flex gap-2 items-center h-8">
        //       <p className="truncate text-b1">{grant.address}</p>
        //       <Copy content={grant.address} />
        //     </div>
        //   </div>
        //   <div className="flex flex-col gap-2 flex-1">
        //     <p className="text-b1-light">Permissions</p>
        //     <div className="flex gap-2 flex-wrap">
        //       {grant.permissions.map((permission, idx) => (
        //         <div className="permission-card" key={idx}>
        //           <div className="flex space-x-2 items-center">
        //             <p className="text-b1">{permission}</p>
        //             <Image
        //               src="/delete.svg"
        //               width={16}
        //               height={16}
        //               alt="delete-icon"
        //               onClick={() => handleDeletePermission(permission)}
        //               style={{ cursor: 'pointer' }}
        //             />
        //           </div>
        //         </div>
        //       ))}
        //     </div>
        //   </div>
        //   <div className="flex flex-col gap-2">
        //     <div className="h-[21px]" />
        //     <div className="flex gap-6 items-center">
        //       <button className="primary-btn" onClick={handleRevokeAll}>
        //         Revoke All
        //       </button>
        //       <div className="secondary-btn" onClick={handleViewDetails}>
        //         View Details
        //       </div>
        //     </div>
        //   </div>
        // </div>
      ))} */}

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

const AuthzGrant: React.FC<AddressGrants> = ({
  chainID,
  address,
  grants,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isRevoke, setIsRevoke] = useState(false);
  // const [selectedPermission, setSelectedPermission] = useState<string>();
  // const [selectPermission, setSelectPermission] = useState<SelectPermission | null>(null);

  const { getChainInfo } = useGetChainInfo();
  const { chainLogo, chainName } = getChainInfo(chainID);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setIsRevoke(false);
  };

  // const handleCloseDeleteDialog = () => {
  //   setDeleteDialogOpen(false);
  //   setSelectedPermission('');
  // };

  const handleRevokeAll = () => {
    setIsRevoke(true)
    setDialogOpen(true);

    // setRevokeDialogOpen(true);
  };

  const handleViewDetails = () => {
    setDialogOpen(true);
  };


  // const dispatch = useAppDispatch();

  return (<>
    <DialogAuthzDetails
      revoke={isRevoke}
      address={address}
      chainID={chainID}
      AddressGrants={grants}
      // handleDeletePermission={handleDeletePermission}
      open={dialogOpen} onClose={handleCloseDialog} />

    {/* <DialogRevokeAll
      open={revokeDialogOpen}
      onClose={handleCloseRevokeDialog}
    /> */}

    {/* <DialogConfirmDelete
      open={deleteDialogOpen}
      onClose={handleCloseDeleteDialog}
      onDelete={handleDelete}
      title="Confirm Delete"
      description={`Are you sure you want to delete the permission "${selectedPermission}"?`}
      loading={false}
    /> */}

    <div
      className="grants-card justify-between gap-16 w-full items-start"
      key={chainID}
    >
      <div className="flex flex-col gap-2 w-[280px]">
        <div className="flex gap-2 items-center">
          <Image
            src={chainLogo}
            width={20}
            height={20}
            alt="network-logo"
          />
          <p className="text-b1-light capitalize">{chainName}</p>
        </div>
        <div className="flex gap-2 items-center h-8">
          <p className="truncate text-b1">{address}</p>
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
          <button className="primary-btn"
            onClick={handleRevokeAll}
          >
            Revoke All
          </button>
          <div className="secondary-btn"
            onClick={handleViewDetails}
          >
            View Details
          </div>
        </div>
      </div>
    </div>
  </>)
}

const GrantCard = ({ idx, g, chainID }: { idx: number, g: Authorization, chainID: string }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string>();
  const [selectPermission, setSelectPermission] = useState<SelectPermission | null>(null);

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
        <p className="text-b1">
          {
            getMsgNameFromAuthz(g)
          }
        </p>
        <Image
          src="/delete.svg"
          width={16}
          height={16}
          alt="delete-icon"
          onClick={() => {
            handleDeletePermission(getMsgNameFromAuthz(g))
            setSelectPermission({
              granter: g.granter,
              grantee: g.grantee,
              typeUrl: getTypeURLFromAuthorization(g)
            })
          }}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  )
}

export default GrantedByMe;
