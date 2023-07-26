import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { getICNSName, setError } from "../features/common/commonSlice";

VoteDialog.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  onVote: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  granters: PropTypes.array.isRequired,
  isAuthzMode: PropTypes.bool.isRequired,
};

export default function VoteDialog(props) {
  const [option, setOption] = React.useState("");
  const dispatch = useDispatch();
  const [granter, setGranter] = React.useState(
    props.granters.length > 0 ? props.granters[0] : ""
  );
  const [justification, setJustification] = React.useState("");
  const govTx = useSelector((state) => state.gov.tx);
  const authzExecTx = useSelector((state) => state.authz.execTx);
  const icnsNames = useSelector((state) => state.common.icnsNames);

  const handleClose = () => {
    setOption("");
    props.closeDialog(true);
  };

  const handleVote = () => {
    if (!option) {
      dispatch(
        setError({
          type: "error",
          message: "Vote option not selected",
        })
      );
      return;
    }
    props.onVote({
      option: option,
      justification: justification,
      granter: granter,
    });
  };

  const handleChange = (e) => {
    setOption(e.target.value);
  };

  const fetchName = (address) => {
    if (!icnsNames?.[address]) {
      dispatch(
        getICNSName({
          address: address,
        })
      );
    }
    return icnsNames?.[address]?.name;
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent>
          <Box>
            <FormControl
              required
              component="fieldset"
              sx={{ m: 2 }}
              variant="standard"
            >
              <Typography variant="body1" color="text.primary" fontWeight={600}>
                Select Vote Option
              </Typography>
              <FormGroup
                sx={{
                  display: "flex",
                  flexDirection: "initial",
                  mt: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option === "yes"}
                      value="yes"
                      onChange={handleChange}
                      name="yes"
                    />
                  }
                  label="Yes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option === "no"}
                      value="no"
                      onChange={handleChange}
                      name="no"
                    />
                  }
                  label="No"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option === "noWithVeto"}
                      value="noWithVeto"
                      onChange={handleChange}
                      name="noWithVeto"
                    />
                  }
                  label="NoWithVeto"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option === "abstain"}
                      value="abstain"
                      onChange={handleChange}
                      name="abstain"
                    />
                  }
                  label="Abstain"
                />
              </FormGroup>
            </FormControl>
            {props.isAuthzMode && props.granters.length > 0 ? (
              <FormControl
                fullWidth
                sx={{
                  mt: 1,
                }}
              >
                <InputLabel id="granter-label">Granter Account</InputLabel>
                <Select
                  labelId="granter-label"
                  id="granter-select"
                  value={granter}
                  label="Granter account"
                  onChange={(e) => {
                    setGranter(e.target.value);
                  }}
                  size="small"
                >
                  {props.granters.map((granter, index) => (
                    <MenuItem id={index} value={granter}>
                      {fetchName('cosmos1vv6hruquzpty4xpks9znkw8gys5x4nsnqw9f4k') || granter}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}

            <FormControl
              fullWidth
              sx={{
                mt: 1,
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="justification"
                value={justification}
                onChange={(e) => {
                  setJustification(e.target.value);
                }}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={
              govTx?.status === "pending" || authzExecTx?.status === "pending"
            }
            onClick={handleVote}
            variant="contained"
            disableElevation
          >
            {govTx?.status === "pending" ||
            authzExecTx?.status === "pending" ? (
              <CircularProgress size={25} />
            ) : (
              "Vote"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
