import * as React from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import GroupCard from "./GroupCard";
import PaginationElement from "./PaginationElement";
import { useNavigate } from "react-router-dom";
import { PER_PAGE } from "../../pages/group/common";
import { NoData } from "./NoData";

export interface GroupsByAdminProps {
  groups: any;
  status: string;
  total: number;
  handlePagination: (key: number) => void;
  onAction: (group: any) => void;
  paginationKey: string;
  notFoundText: string;
  showNotFoundAction: boolean;
}

export default function GroupList(props: GroupsByAdminProps) {
  const { groups, paginationKey, handlePagination, total, status } = props;
  const navigate = useNavigate();
  function navigateTo(path: string) {
    navigate(path);
  }

  return (
    <>
      {status === "pending" ? (
        <CircularProgress sx={{ textAlign: "center" }} />
      ) : null}
      {status !== "pending" && !groups.length ? (
        // <Box
        //   sx={{
        //     display: "flex",
        //     flexGrow: 1,
        //     justifyContent: "center",
        //   }}
        //   component="div"
        // >
          <NoData
            title={props.notFoundText}
            showAction={props.showNotFoundAction}
            onAction={() => {
              navigateTo("/group/create-group");
            }}
            actionText="Create group"
          />
        // </Box>
      ) : null}

      {status !== "pending" && groups?.length > 0 ? (
        <Grid container spacing={{ xs: 2 }}>
          {groups?.map((group: any, index: number) => (
            <Grid item xs={12} sm={12} lg={4} md={4} key={index}>
              <GroupCard group={group} />
            </Grid>
          ))}
        </Grid>
      ) : null}

      {total > PER_PAGE && (
        <PaginationElement
          handlePagination={handlePagination}
          paginationKey={paginationKey}
          total={total}
        />
      )}
    </>
  );
}
