import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const DialogAddNetwork = (props) => {
  const { open, dialogCloseHandle } = props;
  const { control } = useForm({
    defaultValues: {},
  });

  return (
    <>
      <Dialog open={open} onClose={dialogCloseHandle} fullWidth maxWidth="xl">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Add Network</Typography>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => {
              dialogCloseHandle();
            }}
            variant="h5"
          />
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <FormSectionTitle title={"Chain Configuration"} />
            <Grid item xs={6}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Chain Name"
                    size="small"
                    name="Chain Name"
                    placeholder="Chain Name *"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Chain ID"
                    size="small"
                    name="Chain ID"
                    placeholder="Chain ID *"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Rest Endpoint"
                    size="small"
                    name="Rest Endpoint"
                    placeholder="Rest Endpoint *"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="RPC Endpoint"
                    size="small"
                    name="RPC Endpoint"
                    placeholder="RPC Endpoint *"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
            {/* <Grid container columnSpacing={2}> */}
            <Grid item xs={4}>
              <CustomRadioGroup
                control={control}
                rules={{ required: "required" }}
                label={"Is Testnet"}
              />
            </Grid>
            {/* </Grid> */}
          </Grid>
          <Grid container spacing={2}>
            <FormSectionTitle title={"Currency Details"} />
            <Grid item xs={4}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Coin Denom"
                    size="small"
                    name="Coin Denom"
                    placeholder="Eg: ATOM"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Coin Minimal Denom"
                    size="small"
                    name="Coin Minimal Denom"
                    placeholder="Eg: uatom"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Decimals"
                    size="small"
                    name="Decimals"
                    placeholder="Eg: 6"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <FormSectionTitle title={"Bech32 Configuration"} />
            <Grid item xs={4}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Account Address Prefix"
                    size="small"
                    name="Account Address Prefix"
                    placeholder="Eg: cosmos"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <FormSectionTitle title={"Fee Currencies"} />
            <Grid item xs={12}>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <input type="checkbox" style={{ width: 10 }} />
                <Typography fontSize={12}>Same as currency details</Typography>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Coin Denom"
                    size="small"
                    name="Coin Denom"
                    placeholder="Eg: ATOM"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Coin Minimal Denom"
                    size="small"
                    name="Coin Minimal Denom"
                    placeholder="Eg: uatom"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Decimals"
                    size="small"
                    name="Decimals"
                    placeholder="Eg: 6"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item container spacing={2} xs={12}>
              <FormSectionTitle title={"Gas Price Step"} />
              <Grid item xs={4}>
                <Controller
                  name="name"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Low"
                      size="small"
                      name="Low"
                      placeholder="Eg: 0.01"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="name"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Average"
                      size="small"
                      name="Average"
                      placeholder="Eg: 0.025"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="name"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="High"
                      size="small"
                      name="High"
                      placeholder="Eg: 0.03"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <FormSectionTitle title={"Coin Type"} />
            <Grid item xs={4}>
              <Controller
                defaultValue={118}
                name="coinType"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Coin Type"
                    size="small"
                    name="Coin Type"
                    placeholder="Eg: 118"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <FormSectionTitle title={"Stake Currency"} />
            <Grid item xs={12}>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <input type="checkbox" style={{ width: 10 }} />
                <Typography fontSize={12}>Same as currency details</Typography>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Coin Denom"
                    size="small"
                    name="Coin Denom"
                    placeholder="Eg: ATOM"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Coin Minimal Denom"
                    size="small"
                    name="Coin Minimal Denom"
                    placeholder="Eg: uatom"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Decimals"
                    size="small"
                    name="Decimals"
                    placeholder="Eg: 6"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <FormSectionTitle title={"Explorer"} />
            <Grid item xs={6}>
              <Controller
                name="name"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Explorer Tx Hash Endpoint"
                    size="small"
                    name="Explorer Tx Hash Endpoint"
                    placeholder="Eg: https://www.mintscan.io/cosmos/txs/"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container columnSpacing={2}>
            <FormSectionTitle title={"Enable Modules"} />
            <Grid item xs={4}>
              <CustomRadioGroup
                control={control}
                rules={{ required: "required" }}
                label={"Authz"}
              />
            </Grid>
            <Grid item xs={4}>
              <CustomRadioGroup
                control={control}
                rules={{ required: "required" }}
                label={"Feegrant"}
              />
            </Grid>
            <Grid item xs={4}>
              <CustomRadioGroup
                control={control}
                rules={{ required: "required" }}
                label={"Groups"}
              />
            </Grid>
          </Grid>
          <Grid container columnSpacing={2}>
            <FormSectionTitle title={"Enable Amino Config"} />
            <Grid item xs={4}>
              <CustomRadioGroup
                control={control}
                rules={{ required: "required" }}
                label={"Authz"}
              />
            </Grid>
            <Grid item xs={4}>
              <CustomRadioGroup
                control={control}
                rules={{ required: "required" }}
                label={"Feegrant"}
              />
            </Grid>
          </Grid>
          <Grid container columnSpacing={2}>
            <FormSectionTitle title={"Experimental Wallet"} />
            <Grid item xs={4}>
              <CustomRadioGroup
                control={control}
                rules={{ required: "required" }}
                label={"Keplr Experimental"}
              />
            </Grid>
            <Grid item xs={4}>
              <CustomRadioGroup
                control={control}
                rules={{ required: "required" }}
                label={"Leap Experimental"}
              />
            </Grid>
          </Grid>
          <Grid sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="outlined" type="submit">
              Add
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

const FormSectionTitle = ({ title }) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h7" fontWeight={600}>
          {title}
        </Typography>
      </Grid>
    </>
  );
};

const CustomRadioGroup = (props) => {
  const { control, rules, label } = props;
  return (
    <Controller
      name={"a"}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormControl fullWidth>
          <FormLabel sx={{ textAlign: "left" }} id="">
            {label}
          </FormLabel>
          <RadioGroup
            row
            {...field}
            onChange={(e) => {
              // setGroupPolicyType(e.target.value);
              // setDecisionPolicyType(null);
              // setValue("policyMetadata.decisionPolicy", e.target.value);
              // if (e.target.value === THRESHOLD) {
              //   setValue("policyMetadata.percentage", 0);
              // } else {
              //   setValue("policyMetadata.threshold", 0);
              // }
            }}
            // value={decisionPolicyType || groupPolicyType}
          >
            <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
            <FormControlLabel value={"No"} control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      )}
    />
  );
};

export default DialogAddNetwork;
