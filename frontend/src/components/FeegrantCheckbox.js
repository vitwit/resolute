import { Box, Checkbox, Popover, Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

export const FeegrantCheckbox = (props) => {
  const { feegrant, useFeegrant, setUseFeegrant } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return feegrant?.granter ? (
    <Box>
      <Box
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        display="flex"
        alignItems="center"
      >
        <Checkbox
          value={useFeegrant}
          onChange={(e) => {
            setUseFeegrant(e.target.checked);
          }}
          disableRipple
        />
        <Typography sx={{ fontSize: 13 }}>Use Feegrant</Typography>
      </Box>

      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {useFeegrant ? (
          <Typography sx={{ p: 1 }}>
            transaction fee will now be deducted from account address{" "}
            {feegrant?.granter}
          </Typography>
        ) : (
          <Typography sx={{ p: 1 }}>Check this to use feegrant!</Typography>
        )}
      </Popover>
    </Box>
  ) : (
    <></>
  );
};

FeegrantCheckbox.propTypes = {
  setUseFeegrant: PropTypes.func.isRequired,
  feegrant: PropTypes.object.isRequired,
  useFeegrant: PropTypes.bool.isRequired,
};
