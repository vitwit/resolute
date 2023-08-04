import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { copyToClipboard } from "../utils/clipboard";
import { shortenAddress } from "../utils/util";

export const CopyToClipboard = (props) => {
  const { message } = props;
  const toolTipEnabled = props.toolTipEnabled;
  const dispatch = useDispatch();
  return (
    <Box>
      {toolTipEnabled ? (
        <Tooltip title="Copy address">
          <IconButton
            size="small"
            onClick={() => {
              copyToClipboard(message, dispatch);
            }}
          >
            <ContentCopyOutlined sx={{fontSize:12}}/>
          </IconButton>
        </Tooltip>
      ) : (
        <Chip
          label={shortenAddress(message, 24)}
          size="small"
          deleteIcon={<ContentCopyOutlined />}
          onDelete={() => {
            copyToClipboard(message, dispatch);
          }}
        />
      )}
    </Box>
  );
};
