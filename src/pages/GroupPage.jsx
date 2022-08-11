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

export default function GroupPage() {
  const [selectedTab, setSelectedTab] = useState("admin");

  const address = useSelector((state) => state.wallet.address);
  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const groups = useSelector((state) => state.group.groups);
  const dispatch = useDispatch();
  useEffect(() => {
    if (address.length > 0)
      dispatch(
        getGroupsByAdmin({
          baseURL: chainInfo.config.rest,
          admin: address,
        })
      );
  }, [address]);

  useEffect(() => {
    if (address.length > 0 && selectedTab === "member")
      dispatch(
        getGroupsByMember({
          baseURL: chainInfo.config.rest,
          address: address,
        })
      );
  }, [selectedTab]);

  const navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "right",
        }}
      >
        <Button
          variant="contained"
          disableElevation
          onClick={() => {
            navigateTo("/group/create-group");
          }}
          sx={{
            textTransform: "none",
          }}
        >
          Create group
        </Button>
      </Box>
      <Box sx={{ mt: 2, textAlign: "left" }}>
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
            <GroupsByAdmin
              groups={groups.admin.list}
              status={groups.admin.status}
              onAction={(group) => {
                console.log(group);
              }}
            />
          ) : (
            <GroupsByMember
              groups={groups.member.list}
              status={groups.admin.status}
              onAction={(group) => {
                console.log(group);
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
