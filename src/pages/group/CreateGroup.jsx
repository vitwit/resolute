import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import DialogAddGroupMember from "../../components/group/DialogAddGroupMember";
import { Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Controller, useForm } from "react-hook-form";
import { amountToMinimalValue, shortenAddress } from "../../utils/util";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DialogAttachPolicy from "../../components/group/DialogAttachPolicy";
import { useDispatch, useSelector } from "react-redux";
import { resetGroupTx, txCreateGroup } from "../../features/group/groupSlice";
import CreateGroupForm from "./CreateGroupForm";
import CreateGroupPolicy from "./CreateGroupPolicy";
import { useNavigate } from "react-router-dom";
import { setError } from "../../features/common/commonSlice";

export default function CreateGroupPage() {
  const [members, setMembers] = useState([]);
  const wallet = useSelector((state) => state.wallet);
  const { chainInfo, connected, address } = wallet;
  const navigate = useNavigate();
  const txRes = useSelector(state => state?.group?.tx);

  useEffect(() => {
    return () => {
      dispatch(resetGroupTx());
    }
  })

  useEffect(() => {
    if (txRes?.status === 'idle') {
      navigate(`/group`)
    }
  }, [txRes?.status])

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

  const dispatch = useDispatch();

  const handleMembers = members => setMembers([...members])

  const handlePolicy = policy => setPolicyData({ ...policy })


  const onSubmit = (data) => {
    const dataObj = {
      admin: address,
      granter: address,
      grantee: data.grantee,
      members,
      policyData,
      groupMetaData: data?.metadata,
      expiration: data.expiration,
      chainId: chainInfo.config.chainId,
      rpc: chainInfo.config.rpc,
      feeAmount: chainInfo.config.gasPriceStep.average,
    }

    dispatch(txCreateGroup(dataObj))
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
    // setShowMemberDialog(true);
  };

  const [policyDialogOpen, setpolicyDialogOpen] = useState(false);
  const [policyData, setPolicyData] = useState({});
  const onAttachPolicy = (data) => {
    setpolicyDialogOpen(false);
    setPolicyData(data);
  };

  return (
    <Box>

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
            width: '70%',
            margin: '0 auto'
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
                    multiline
                    fullWidth
                  />
                )}
              />
            </div>

            <Box
              sx={{
                display: "flex",
                justifyContent: "right",
              }}
            >
              &nbsp;
            </Box>
            <Box>
              <CreateGroupForm handleMembers={handleMembers} />
              <br />
              <CreateGroupPolicy handlePolicy={handlePolicy} />
            </Box>

            <Button
              onClick={()=>navigate(`/group`)}
              color="error"
              variant="outlined"
              disableElevation
              size="medium"
              sx={{
                mt: 2,
                mr: 2
              }}
            >
              cancel

            </Button>
            <Button
              type="submit"
              variant="outlined"
              disableElevation
              size="medium"
              sx={{
                mt: 2,
              }}
            >
              {
                txRes?.status === 'pending' ? 'Loading...' : 'Create'
              }

            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
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
