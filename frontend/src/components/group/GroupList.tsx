import React from "react";
import { CircularProgress, Grid, Typography } from "@mui/material";
import GroupCard from "./GroupCard";
import PaginationElement from "./PaginationElement";
import { useNavigate } from "react-router-dom";
import { PER_PAGE } from "../../pages/group/common";
import { NoData } from "./NoData";

export interface GroupsByAdminProps {
  groups: any[];
  status: string;
  total: number;
  handlePagination: (key: number) => void;
  onAction: (group: any) => void;
  paginationKey: string;
  notFoundText: string;
  showNotFoundAction: boolean;
  networkName: string;
}

export default function GroupList(props: GroupsByAdminProps) {
  const { groups, paginationKey, handlePagination, total, status, networkName } = props;
  const navigate = useNavigate();

  function navigateTo(path: string) {
    navigate(path);
  }

  return (
    <>
      {status === "pending" ? (
        <CircularProgress sx={{ textAlign: "center" }} />
      ) : null}
      {status !== "pending" && !groups?.length ? (
        <Typography
          variant="h6"
          color="text.primary"
          sx={{
            p: 2,
          }}
        >
          {props.notFoundText}
        </Typography>
      ) : null}

      {status !== "pending" && groups?.length > 0 ? (
        <Grid container spacing={2}>
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
          total={total / PER_PAGE}
        />
      )}
    </>
  );
}
