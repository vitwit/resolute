import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { resetError, setError } from "../../features/common/commonSlice";
import {
  createAccount,
  resetCreateMultisigRes,
} from "../../features/multisig/multisigSlice";
import { isValidPubKey, generateMultisigAccount } from "../../txns/multisig";
import Box from "@mui/system/Box";
import { THRESHOLD } from "../../pages/group/common";
import { getToken } from "../../utils/localStorage";

const InputTextComponent = ({
  field,
  index,
  handleChangeValue,
  handleRemoveValue,
}) => {
  return (
    <TextField
      onChange={(e) => handleChangeValue(index, e)}
      sx={{ mb: 1, mt: 1 }}
      name={field.name}
      value={field.value}
      required={field?.required}
      label={field.label}
      placeholder={field.placeHolder}
      fullWidth
      disabled={field.disabled}
      InputProps={{
        endAdornment: (
          <InputAdornment
            onClick={() =>
              !field.disabled
                ? handleRemoveValue(index)
                : alert("cannot self remove")
            }
            position="end"
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            <DeleteIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

const DialogCreateMultisig = (props) => {
  const { onClose, open, addressPrefix, chainId, address, pubKey } = props;
  const wallet = useSelector((state) => state.wallet);
  const createMultiAccRes = useSelector(
    (state) => state.multisig.createMultisigAccountRes
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (createMultiAccRes?.status === "idle") {
      dispatch(setError({ type: "success", message: "Successfully created" }));
    } else if (createMultiAccRes?.status === "rejected") {
      dispatch(setError({ type: "error", message: createMultiAccRes?.error }));
    }
  }, [createMultiAccRes]);

  const pubKeyObj = {
    name: "pubKey",
    value: "",
    label: "Public Key (Secp256k1)",
    placeHolder: "E. g. AtgCrYjD+21d1+og3inzVEOGbCf5uhXnVeltFIo7RcRp",
    required: true,
    disabled: false,
  };

  const [pubKeyFields, setPubKeyFields] = useState([]);
  const [threshold, setThreshold] = useState(0);
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setPubKeyFields([
      {
        name: "current",
        value: pubKey,
        label: "Public Key (Secp256k1)",
        placeHolder: "E. g. AtgCrYjD+21d1+og3inzVEOGbCf5uhXnVeltFIo7RcRp",
        required: true,
        disabled: true,
      },
      { ...pubKeyObj },
    ]);
  }, [wallet]);

  const handleAddPubKey = () => {
    if (pubKeyFields?.length > 6) {
      dispatch(
        setError({
          type: "error",
          message: "You can't add more than 7 pub keys",
        })
      );
      return;
    } else {
      setPubKeyFields([...pubKeyFields, pubKeyObj]);
    }
  };

  const handleRemoveValue = (i) => {
    if (pubKeyFields.length > 1) {
      pubKeyFields.splice(i, 1);
      setPubKeyFields([...pubKeyFields]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (Number(threshold) < 1) {
      dispatch(
        setError({ type: "error", message: "Threshold must be greater than 1" })
      );
      return;
    }

    let pubKeys = pubKeyFields.map((v) => v.value);

    if (!pubKeys?.length) {
      dispatch(setError("At least 1 pubkey is required"));
      return;
    }

    const uniquePubKeys = Array.from(new Set(pubKeys));
    if (uniquePubKeys?.length !== pubKeys?.length) {
      dispatch(
        setError({
          type: "error",
          message: "You have entered duplicate pubkeys",
        })
      );
      return;
    }

    for (let i = 0; i < uniquePubKeys.length; i++) {
      if (!isValidPubKey(uniquePubKeys[i])) {
        setFormError(`pubKey at ${i + 1} is invalid`);
        return;
      }
    }

    try {
      let res = generateMultisigAccount(
        pubKeys,
        Number(threshold),
        addressPrefix
      );
      res.name = name;
      res.chainId = chainId;
      res.createdBy = address;
      const queryParams = {
        address: address,
        signature: getToken(),
      };
      dispatch(
        createAccount({
          queryParams: queryParams,
          data: res,
        })
      );
    } catch (error) {
      dispatch(setError({ type: "error", message: error }));
    }
  };

  const handleChangeValue = (index, e) => {
    const newInputFields = pubKeyFields.map((value, key) => {
      if (index === key) {
        value["value"] = e.target.value;
      }
      return value;
    });

    setPubKeyFields(newInputFields);
  };

  const handleChange = (e) => {
    if (e.target.value > pubKeyFields?.length) {
      alert("Threshold can not be greater than pubkeys");
      return;
    }
    setThreshold(e.target.value);
  };

  const handleClose = () => {
    dispatch(resetCreateMultisigRes());
    dispatch(resetError());
    setFormError("");
    onClose();
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <>
      <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }} variant="h6">
          Create Multisig Account
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              onChange={handleNameChange}
              name="name"
              value={name}
              required
              label="Name"
              placeholder="Eg: Alice-Bob-Eve-Msig"
              fullWidth
            />
            <Typography
              sx={{
                mt: 2,
              }}
              gutterBottom
              variant="body1"
              color="text.primary"
              fontWeight={600}
            >
              Members
            </Typography>
            {pubKeyFields.map((field, index) => (
              <InputTextComponent
                key={index}
                handleRemoveValue={handleRemoveValue}
                handleChangeValue={handleChangeValue}
                index={index}
                field={field}
              />
            ))}
            <Typography color="error" variant="caption">
              {formError}
            </Typography>
            <Box
              sx={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={handleAddPubKey}
                variant="contained"
                disableElevation
                sx={{
                  textTransform: "none",
                }}
              >
                +&nbsp;New member
              </Button>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 2,
                textAlign: "center",
              }}
            >
              Threshold: Signatures required to send a transaction
            </Typography>

            <Box
              sx={{
                mt: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                name={THRESHOLD}
                value={threshold}
                inputProps={{ maxLength: 1 }}
                onChange={handleChange}
                label=""
                type="number"
                size="small"
                style={{ maxWidth: 75 }}
              />
              <Typography
                variant="body1"
                color="text.primary"
                style={{ margin: "auto 0px auto 0px" }}
              >
                &nbsp;&nbsp;Of&nbsp;&nbsp;
              </Typography>
              <TextField
                name={THRESHOLD}
                value={pubKeyFields?.length}
                label=""
                disabled
                size="small"
                style={{ maxWidth: 75 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                textTransform: "none",
              }}
              disableElevation
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disableElevation
              type="submit"
              disabled={createMultiAccRes?.status === "pending"}
              sx={{
                textTransform: "none",
              }}
            >
              {createMultiAccRes?.status === "pending" ? (
                <CircularProgress size={25} />
              ) : (
                "Create"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

DialogCreateMultisig.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  addressPrefix: PropTypes.string.isRequired,
  chainId: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

export default DialogCreateMultisig;
