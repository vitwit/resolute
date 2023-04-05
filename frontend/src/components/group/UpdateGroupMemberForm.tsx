import {
  Box,
  TextField,
  IconButton,
  Grid,
  Button,
  TableRow,
} from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { StyledTableCell, StyledTableRow } from "../CustomTable";

interface UpdateGroupMemberFormProps {
  members: any[];
  handleUpdate: any;
}

export function UpdateGroupMemberForm({
  members,
  handleUpdate,
}: UpdateGroupMemberFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    trigger,
    setError,
  } = useForm({
    defaultValues: {
      members: members.map((m: any) => ({
        ...m,
        disabled: true,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  return (
    <>
      {fields.map((item, index) => {
        return (
          <TableRow key={index}>
            <StyledTableCell>
              <Controller
                name={`members.${index}.member.address`}
                control={control}
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    variant="standard"
                    name="address"
                    disabled={item.disabled}
                    fullWidth
                  />
                )}
              />
            </StyledTableCell>
            <StyledTableCell>
              <Controller
                name={`members.${index}.member.weight`}
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
                    variant="standard"
                    name="weight"
                    fullWidth
                  />
                )}
              />
            </StyledTableCell>
            <StyledTableCell>
              <Controller
                name={`members.${index}.member.metadata`}
                control={control}
                rules={{ required: "Metadata is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    multiline
                    name="metadata"
                    variant="standard"
                    fullWidth
                  />
                )}
              />
            </StyledTableCell>
            <StyledTableCell>
              <IconButton onClick={() => remove(index)} color="error">
                <DeleteOutline />
              </IconButton>
              {index === fields.length - 1 ? (
                <IconButton
                  onClick={() => {
                    append({ address: "", metadata: "", weight: 0 });
                  }}
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              ) : null}
            </StyledTableCell>
          </TableRow>
        );
      })}

      {/* <Box sx={{ p: 2 }}>
            <Button
              sx={{ mr: 2 }}
              variant="outlined"
              onClick={() => handleCancel()}
              color="error"
            >
              Cancel
            </Button>
            <Button type="submit" variant="outlined" color="primary">
              Update
            </Button>
          </Box> */}
      {/* </form> */}
    </>
  );
}

export default UpdateGroupMemberForm;
