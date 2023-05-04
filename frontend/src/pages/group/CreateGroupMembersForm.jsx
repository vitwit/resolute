import React from "react";
import { Box, TextField, IconButton, Grid, Button } from "@mui/material";
import { Controller } from "react-hook-form";
import Close from "@mui/icons-material/Close";

export function CreateGroupMembersForm({ fields, control, append, remove }) {
  return (
    <Box>
      {(fields?.length && (
        <>
          {fields.map((item, index) => {
            return (
              <Grid key={item?.id} container columnSpacing={{ md: 2, xs: 2 }} sx={{marginY:"12px"}}>
                <Grid item md={4} xs={4.5}>
                  <Controller
                    name={`members.${index}.address`}
                    control={control}
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        label="Member Address"
                        name="address"
                        size="small"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item md={1.5} xs={2}>
                  <Controller
                    name={`members.${index}.weight`}
                    control={control}
                    rules={{
                      min: 1,
                      required: "Weight is required",
                    }}
                    render={({ field }) => (
                      <TextField
                        type={"number"}
                        {...field}
                        required
                        label="Weight"
                        size="small"
                        name="weight"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item md={5} xs={4.5}>
                  <Controller
                    name={`members.${index}.metadata`}
                    control={control}
                    rules={{ required: "Metadata is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        label="Member Metadata"
                        size="small"
                        multiline
                        name="metadata"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid sx={{ display: "flex" }} item container md={1.5} xs={1}>
                  {index === 0 ? (
                    <></>
                  ) : (
                    <IconButton
                      onClick={() => {
                        if (index !== 0) remove(index);
                      }}
                      color="error"
                    >
                      <Close />
                    </IconButton>
                  )}
                </Grid>
                {fields.length - 1 === index ? (
                  <Button
                    size="small"
                    onClick={() => {
                      append({ address: "", metadata: "", weight: 0 });
                    }}
                    sx={{ ml: "auto", textTransform: "none", mt:"12px" }}
                    variant="outlined"
                  >
                    Add Another Member
                  </Button>
                ) : null}
              </Grid>
            );
          })}
        </>
      )) ||
        null}
    </Box>
  );
}

export default CreateGroupMembersForm;
