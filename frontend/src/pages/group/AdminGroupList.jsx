import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import GroupList from "../../components/group/GroupList";
import { getGroupsByAdmin } from "../../features/group/groupSlice";
import { PER_PAGE } from "./common";

function AdminGroupList() {
  const [adminTotal, setAdminTotal] = useState(0);
  const dispatch = useDispatch();

  const params = useParams();

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [currentNetwork, setCurrentNetwork] = useState(params?.networkName || selectedNetwork);

  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const address =
    networks[nameToChainIDs[currentNetwork]]?.walletInfo.bech32Address;

  const chainInfo = networks[nameToChainIDs[currentNetwork]]?.network;
  
  const groups = useSelector((state) => state.group.groups);

  const fetchGroupsByAdmin = (offset = 0, limit = PER_PAGE) => {
    dispatch(
      getGroupsByAdmin({
        baseURL: chainInfo.config.rest,
        admin: address,
        pagination: {
          offset,
          limit,
        },
      })
    );
  };

  useEffect(() => {
    if (address)
    fetchGroupsByAdmin(0, PER_PAGE);
  }, [address]);

  useEffect(() => {
    if (Number(groups?.admin?.pagination?.total))
      setAdminTotal(Number(groups?.admin?.pagination?.total));
  }, [groups?.admin?.pagination?.total]);

  const handlePagination = (page) => {
    fetchGroupsByAdmin(page*PER_PAGE, PER_PAGE);
  };

  return (
    <GroupList
      total={adminTotal}
      groups={groups.admin.list}
      status={groups.admin.status}
      paginationKey={groups?.admin?.pagination?.next_key}
      handlePagination={handlePagination}
      notFoundText="No groups found"
      showNotFoundAction={true}
    />
  );
}

export default AdminGroupList;
