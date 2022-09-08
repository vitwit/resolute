import React, { useEffect, useState } from "react";
import Box from "@mui/system/Box";
import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";
import GroupsByAdmin from "../components/GroupsByAdmin";
import { useDispatch, useSelector } from "react-redux";
import {
  getGroupsByAdmin,
  getGroupsByMember,
} from "../features/group/groupSlice";
import { useNavigate } from "react-router-dom";
import GroupsByMember from "../components/group/GroupsByMember";
import GroupList from "../components/group/GroupList";
import { groupStyles } from "./group/group-css";
import GroupAddIcon from '@mui/icons-material/GroupAdd';

export default function GroupPage() {
  const [selectedTab, setSelectedTab] = useState("admin");
  const address = useSelector((state) => state.wallet.address);
  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const groups = useSelector((state) => state.group.groups);
  const [adminTotal, setAdminTotal] = useState(0);
  const [memberTotal, setMemberTotal] = useState(0);
  const limit = 9;

  useEffect(() => {
    if (Number(groups?.admin?.pagination?.total))
      setAdminTotal(Number(groups?.admin?.pagination?.total))
  }, [groups?.admin?.pagination?.total])

  useEffect(() => {
    if (Number(groups?.member?.pagination?.total))
      setMemberTotal(Number(groups?.member?.pagination?.total))
  }, [groups?.member?.pagination?.total])

  const dispatch = useDispatch();

  const fetchGroupsByMember = (offset = 0, limit = 9) => {
    dispatch(
      getGroupsByMember({
        baseURL: chainInfo.config.rest,
        address: address,
        pagination: {
          offset,
          limit
        }
      })
    );
  }

  const fetchGroupsByAdmin = (offset = 0, limit = 9) => {
    dispatch(
      getGroupsByAdmin({
        baseURL: chainInfo.config.rest,
        admin: address,
        pagination: {
          offset,
          limit
        }
      })
    );
  }

  useEffect(() => {
    if (address.length > 0) {
      fetchGroupsByAdmin(0, limit);
    }
  }, [address]);

  useEffect(() => {
    if (address.length > 0 && selectedTab === "member") {
      fetchGroupsByMember(0, limit)
    }
  }, [selectedTab]);

  const handlePagination = (page) => {
    fetchGroupsByMember(page, limit)
    fetchGroupsByAdmin(page, limit)
  }

  const navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box
        component="div"
        sx={groupStyles.gp_main}
      >
        <Button
          variant="contained"
          disableElevation
          onClick={() => {
            navigateTo("/group/create-group");
          }}
          endIcon={
            <GroupAddIcon />
          }
          sx={groupStyles.t_transform}
        >
          Create group
        </Button>
      </Box>
      <Box sx={groupStyles.btn_g_box}>
        <ButtonGroup disableElevation>
          <Button
            onClick={() => setSelectedTab("admin")}
            variant={selectedTab === "admin" ? "contained" : "outlined"}
          >
            Created by me
          </Button>
          <Button
            onClick={() => setSelectedTab("member")}
            variant={selectedTab === "member" ? "contained" : "outlined"}
          >
            Part of
          </Button>
        </ButtonGroup>
        <Box component="div" sx={{ mt: 1 }}>
          {selectedTab === "admin" ? (
            <GroupList
              total={adminTotal}
              groups={groups.admin.list}
              status={groups.admin.status}
              paginationKey={groups?.admin?.pagination?.next_key}
              handlePagination={handlePagination}
            />
          ) : (
            <GroupList
              total={memberTotal}
              handlePagination={handlePagination}
              paginationKey={groups?.member?.pagination?.next_key}
              groups={groups.member.list}
              status={groups.member.status}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
