import Button from "@mui/material/Button";
import React, { useState } from "react";
import DialogAddGroupMember from "../../components/group/DialogAddGroupMember";
import { IconButton, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Controller, useForm } from "react-hook-form";
import { shortenAddress } from "../../utils/util";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DialogAttachPolicy from "../../components/group/DialogAttachPolicy";

export default function CreateGroupPage() {
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [members, setMembers] = useState([]);

  const showGroupMemberDialog = () => {
    setShowMemberDialog(true);
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      metadata: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const [memberFields, setMemberFields] = useState({
    address: "",
    weight: "",
    metadata: "",
  });
  const removeMember = (address) => {
    const newMembers = members.filter(function (member) {
      return member.address != address;
    });
    setMembers(newMembers);
  };

  const editMember = (address, weight, metadata) => {
    setMemberFields({
      address: address,
      weight: weight,
      metadata: metadata,
    });
    setShowMemberDialog(true);
  };

  const [policyDialogOpen, setpolicyDialogOpen] = useState(false);
  const [policyData, setPolicyData] = useState({});
  const onAttachPolicy = (data) => {
    setpolicyDialogOpen(false);
    setPolicyData(data);
  };

  return (
    <>
      {showMemberDialog ? (
        <DialogAddGroupMember
          open={showMemberDialog}
          defaultFields={memberFields}
          onAddMember={(address, metadata, weight) => {
            for (let i = 0; i < members.length; i++) {
              if (members[i].address === address) {
                members[i] = {
                  address: address,
                  metadata: metadata,
                  weight: weight,
                };
                setShowMemberDialog(false);
                return;
              }
            }

            setMembers([
              ...members,
              {
                address: address,
                metadata: metadata,
                weight: weight,
              },
            ]);

            setShowMemberDialog(false);
          }}
          onClose={() => setShowMemberDialog(false)}
        />
      ) : (
        <></>
      )}
      {policyDialogOpen ? (
        <DialogAttachPolicy
          open={policyDialogOpen}
          onClose={() => setpolicyDialogOpen(false)}
          onAttachPolicy={onAttachPolicy}
        />
      ) : (
        <></>
      )}
      <Paper elevation={0} sx={{ p: 2, textAlign: "center" }}>
        <Typography color="text.primary" variant="h6" fontWeight={600}>
          Create Group
        </Typography>
        <Box
          noValidate
          autoComplete="off"
          sx={{
            "& .MuiTextField-root": { mt: 1.5, mb: 1.5 },
            p: 2,
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Controller
                name="metadata"
                control={control}
                rules={{ required: "Metadata is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Group Metadata"
                    fullWidth
                  />
                )}
              />
            </div>
            <div>
              {members.length > 0 ? (
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                  style={{ textAlign: "left" }}
                >
                  Members
                </Typography>
              ) : (
                ""
              )}
              {members.map((member, index) => (
                <MemberItem
                  key={index}
                  member={member}
                  onRemove={removeMember}
                  onEdit={editMember}
                />
              ))}
            </div>
            {policyData.metadata?.length > 0 ? (
              <div>
                <Typography variant="body1" color="text.primary">
                  DecisionPolicy
                </Typography>
                {JSON.stringify(policyData)}
              </div>
            ) : (
              <></>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "right",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setpolicyDialogOpen(true);
                }}
                sx={{
                  textTransform: "none",
                }}
              >
                Attach decision policy
              </Button>
              &nbsp;
              <Button
                variant="outlined"
                onClick={() => {
                  setMemberFields({
                    address: "",
                    metadata: "",
                    weight: "",
                  });
                  showGroupMemberDialog();
                }}
                sx={{
                  textTransform: "none",
                }}
              >
                Add Group Member
              </Button>
            </Box>

            <Button
              type="submit"
              variant="outlined"
              disableElevation
              size="medium"
              sx={{
                mt: 2,
              }}
            >
              Create
            </Button>
          </form>
        </Box>
      </Paper>
    </>
  );
}

function MemberItem(props) {
  const { address, weight, metadata } = props.member;
  const { onRemove, onEdit } = props;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        ml: 1,
        mr: 1,
      }}
    >
      <TextField
        value={shortenAddress(address, 21)}
        variant="standard"
        size="small"
        disabled
        label=""
      ></TextField>
      <TextField
        value={weight}
        variant="standard"
        size="small"
        disabled
        label=""
        sx={{
          maxWidth: 50,
        }}
      ></TextField>
      <TextField
        value={metadata}
        variant="standard"
        size="small"
        disabled
        label=""
      ></TextField>
      <div>
        <IconButton
          aria-label="remove member"
          color="error"
          onClick={() => onRemove(address)}
        >
          <DeleteOutline />
        </IconButton>
        <IconButton
          aria-label="edit member"
          color="secondary"
          onClick={() => onEdit(address, weight, metadata)}
        >
          <ModeEditOutlineOutlinedIcon />
        </IconButton>
      </div>
    </Box>
  );
}
