import React, { useState } from "react";
import { Paper, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { Grid } from "@mui/material";

export function CreateGroupInfoForm(props) {
  const {
    control,
    setGroupDescError,
    setGroupNameError,
    setGroupForumError,
    groupNameError,
    groupForumError,
    groupDescError,
    watchAllFields,
    groupName,
    forumUrl,
    description,
  } = props;

  const groupInfoErrors = {
    nameErrors: [
      "name cannot be empty",
      "name cannot contain more than 25 characters",
    ],
    descErrors: [
      "description cannot be empty",
      "description cannot contain more than 100 characters",
    ],
    forumErrors: [
      "forum URL cannot be empty",
      "forum URL cannot contain more than 70 characters",
    ],
  };
  return (
    <>
      {/* group info section start */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
        }}
      >
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Controller
              defaultValue={groupName}
              name="name"
              control={control}
              rules={{ required: "Name is required", maxLength: 25 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label="Name"
                  size="small"
                  name="Group name"
                  fullWidth
                  sx={{
                    mb: 2,
                  }}
                  error={groupNameError}
                  helperText={
                    watchAllFields.name?.trim().length <= 25 &&
                    watchAllFields.name?.trim().length > 0
                      ? setGroupNameError("")
                      : groupNameError ||
                        watchAllFields.name?.trim().length === 0 ||
                        !watchAllFields.name?.trim().length
                      ? groupNameError
                      : watchAllFields.name?.trim().length <= 25
                      ? setGroupNameError("")
                      : setGroupNameError(groupInfoErrors.nameErrors[1])
                  }
                />
              )}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Controller
              defaultValue={forumUrl}
              name="forumUrl"
              control={control}
              rules={{ required: "Forum url is required", maxLength: 70 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label="Forum URL"
                  size="small"
                  name="Group forum"
                  fullWidth
                  sx={{
                    mb: 2,
                  }}
                  error={groupForumError}
                  helperText={
                    watchAllFields.forumUrl?.trim().length <= 70 &&
                    watchAllFields.forumUrl?.trim().length > 0
                      ? setGroupForumError("")
                      : groupForumError ||
                        watchAllFields.forumUrl?.trim().length === 0 ||
                        !watchAllFields.forumUrl?.trim().length
                      ? groupForumError
                      : watchAllFields.forumUrl?.trim().length <= 70
                      ? setGroupForumError("")
                      : setGroupForumError(groupInfoErrors.forumErrors[1])
                  }
                />
              )}
            />
          </Grid>
        </Grid>
        <div>
          <Controller
            defaultValue={description}
            name="description"
            control={control}
            rules={{
              required: "Description is required",
              maxLength: 100,
            }}
            render={({ field }) => (
              <TextField
                defaultValue={description}
                {...field}
                required
                label="Description"
                multiline
                size="small"
                name="Group description"
                fullWidth
                sx={{
                  mb: 2,
                }}
                error={groupDescError}
                helperText={
                  watchAllFields.description?.trim().length <= 100 &&
                  watchAllFields.description?.trim().length > 0
                    ? setGroupDescError("")
                    : groupDescError ||
                      watchAllFields.description?.trim().length === 0 ||
                      !watchAllFields.description?.trim().length
                    ? groupDescError
                    : watchAllFields.description?.trim().length <= 100
                    ? setGroupDescError("")
                    : setGroupDescError(groupInfoErrors.descErrors[1])
                }
              />
            )}
          />
        </div>
      </Paper>
      {/* group info section end */}
    </>
  );
}

export default CreateGroupInfoForm;
