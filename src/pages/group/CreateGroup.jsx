import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { resetGroupTx, txCreateGroup } from "../../features/group/groupSlice";
import CreateGroupForm from "./CreateGroupForm";
import CreateGroupPolicy from "./CreateGroupPolicy";
import { useNavigate } from "react-router-dom";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';


export default function CreateGroupPage() {
  const [showAddPolicyForm, setShowAddPolicyForm] = useState(null);

  const wallet = useSelector((state) => state.wallet);
  const { chainInfo, connected, address } = wallet;
  const navigate = useNavigate();
  const txCreateGroupRes = useSelector(state => state?.group?.txCreateGroupRes);

  useEffect(() => {
    return () => {
      dispatch(resetGroupTx());
    }
  }, [])

  useEffect(() => {
    if (txCreateGroupRes?.status === 'idle') {
      navigate(`/group`)
    }
  }, [txCreateGroupRes?.status])

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const dataObj = {
      admin: address,
      granter: address,
      grantee: data.grantee,
      members: data.members,
      groupMetaData: data?.metadata,
      expiration: data?.expiration,
      chainId: chainInfo.config.chainId,
      rpc: chainInfo.config.rpc,
      feeAmount: chainInfo.config.gasPriceStep.average,
      denom: chainInfo?.config?.currencies?.[0]?.coinMinimalDenom
    }

    if (data.policyMetadata) {
      dataObj['policyData'] = data.policyMetadata
    }

    dispatch(txCreateGroup(dataObj))
  };


  const { register, control,
    handleSubmit,
    watch,
    formState: { errors },
    reset, trigger, setError } = useForm({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members"
  });

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
                    name="Group Metadata"
                    fullWidth
                  />
                )}
              />
            </div>
            <Box component={'div'} sx={{
              display: 'flow-root',
              textAlign: 'right'
            }}>

              {
                !fields?.length && <Button
                  onClick={() => {
                    append({ address: '', weight: 0, metadata: '' })
                  }}
                  endIcon={
                    <PersonAddAltIcon />
                  }
                  variant="outlined"
                  sx={{
                    width: '202px',
                    textTransform: "none",
                  }}
                >
                  Add Group Member
                </Button> || null
              }

              <CreateGroupForm
                fields={fields}
                control={control}
                append={append}
                remove={remove}
              />

              {
                fields?.length && (
                  !showAddPolicyForm && <Button
                    onClick={() => setShowAddPolicyForm(true)}
                    endIcon={
                      <PlaylistAddIcon />
                    }
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    Attach Decision Policy
                  </Button> || null) || null
              }

              {
                showAddPolicyForm &&
                <CreateGroupPolicy
                  handleCancelPolicy={() => {
                    setShowAddPolicyForm(false)
                  }}
                  register={register}
                  errors={errors}
                  fields={fields}
                  watch={watch}
                  control={control} />
              }
            </Box>

            <Button
              onClick={() => navigate(`/group`)}
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
                txCreateGroupRes?.status === 'pending' ? 'Loading...' : 'Create'
              }
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
