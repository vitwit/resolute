import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export default function VoteDialog(props) {
  const [option, setOption] = React.useState("");
  const govTx = useSelector((state) => state.gov.tx);
  const authzExecTx = useSelector((state) => state.authz.execTx);

  const handleClose = () => {
    setOption("");
    props.closeDialog(true);
  };

  const handleVote = () => {
    props.onVote(option);
  };

  const handleChange = (e) => {
    setOption(e.target.value);
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>Vote</DialogTitle>
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
              <FormGroup>
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
