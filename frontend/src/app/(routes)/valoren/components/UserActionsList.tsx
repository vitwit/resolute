import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import PageHeader from '@/components/common/PageHeader';
import {
  getUserActions,
  resetRegisterActionRes,
} from '@/store/features/valoren/valorenSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import ActionDialog from './ActionDialog';
import CustomButton from '@/components/common/CustomButton';
import ActionTable from './ActionTable';

const UserActionsList = ({ chainID }: { chainID: string }) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { address } = getChainInfo(chainID);

  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (address) {
      dispatch(getUserActions(address));
    }
  }, [address, dispatch]);

  const actionsLoading = useAppSelector(
    (state) => state.valoren.userActions.status
  );
  const actions = useAppSelector((state) => state.valoren.userActions.actions);

  useEffect(() => {
    return () => {
      dispatch(resetRegisterActionRes());
    };
  }, []);

  return (
    <div className="space-y-10">
      {/* Page Header with Register Action Button */}
      <div className="flex justify-between items-end gap-6">
        <div className="flex-1">
          <PageHeader
            title="Valoren"
            description="Cosmos stake management : Auto Restake and Auto Redelegate"
          />
        </div>
        <CustomButton
          btnText="Register Action"
          btnOnClick={() => setDialogOpen(true)}
        />
      </div>

      <ActionTable
        actions={actions}
        actionsLoading={actionsLoading}
        chainID={chainID}
      />

      {isDialogOpen ? (
        <ActionDialog
          open={isDialogOpen}
          onClose={() => setDialogOpen(false)}
          chainID={chainID}
        />
      ) : null}
    </div>
  );
};

export default UserActionsList;
