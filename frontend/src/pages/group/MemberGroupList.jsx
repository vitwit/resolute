import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GroupList from "../../components/group/GroupList";
import { getGroupsByMember } from "../../features/group/groupSlice";
import { PER_PAGE } from "./common";

function MemberGroupList() {
  const [memberTotal, setMemberTotal] = useState(0);
  const dispatch = useDispatch();

  const address = useSelector((state) => state.wallet.address);
  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const groups = useSelector((state) => state.group.groups);

  const fetchGroupsByMember = (offset = 0, limit = PER_PAGE) => {
    dispatch(
      getGroupsByMember({
        baseURL: chainInfo.config.rest,
        address: address,
        pagination: {
          offset,
          limit,
        },
      })
    );
  };

  const handlePagination = (page) => {
    fetchGroupsByMember(page, PER_PAGE);
  };

  useEffect(() => {
    fetchGroupsByMember(0, PER_PAGE);
  }, [address]);

  useEffect(() => {
    if (Number(groups?.member?.pagination?.total))
      setMemberTotal(Number(groups?.member?.pagination?.total));
  }, [groups?.member?.pagination?.total]);

  return (
    <GroupList
      total={memberTotal}
      handlePagination={handlePagination}
      paginationKey={groups?.member?.pagination?.next_key}
      groups={groups.member.list}
      status={groups.member.status}
      notFoundText="Not part of any group"
      showNotFoundAction={false}
    />
  );
}

export default MemberGroupList;
