import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GroupList from "../../components/group/GroupList";
import { getGroupsByAdmin } from "../../features/group/groupSlice";
import { PER_PAGE } from "./common";

function AdminGroupList() {
  const [adminTotal, setAdminTotal] = useState(0);
  const dispatch = useDispatch();

  const address = useSelector((state) => state.wallet.address);
  const chainInfo = useSelector((state) => state.wallet.chainInfo);
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
