import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import React from "react";

const MULTISIG_SEND_TEMPLATE = "https://api.resolute.vitwit.com/_static/send.csv";
const MULTISIG_DELEGATE_TEMPLATE =
  "https://api.resolute.vitwit.com/_static/delegate.csv";
const MULTISIG_UNDELEGATE_TEMPLATE =
  "https://api.resolute.vitwit.com/_static/undelegate.csv";
const MULTISIG_REDELEGATE_TEMPLATE =
  "https://api.resolute.vitwit.com/_static/redelegate.csv";

const TYPE_SEND = "SEND";
const TYPE_DELEGATE = "DELEGATE";
const TYPE_UNDELEGATE = "UNDELEGATE";
const TYPE_REDELEGATE = "REDELEGATE";

interface FileProposalOptionsProps {
  txType: string;
  onFileContents: any;
}

function FileProposalOptions({
  txType,
  onFileContents,
}: FileProposalOptionsProps) {
  return (
    <Box>
      <Button
        variant="contained"
        disableElevation
        size="small"
        endIcon={<FileDownloadOutlinedIcon />}
        sx={{
          textTransform: "none",
        }}
        onClick={() => {
          switch (txType) {
            case TYPE_SEND:
              window.open(
                MULTISIG_SEND_TEMPLATE,
                "_blank",
                "noopener,noreferrer"
              );
              break;
            case TYPE_DELEGATE:
              window.open(
                MULTISIG_DELEGATE_TEMPLATE,
                "_blank",
                "noopener,noreferrer"
              );
              break;
            case TYPE_UNDELEGATE:
              window.open(
                MULTISIG_UNDELEGATE_TEMPLATE,
                "_blank",
                "noopener,noreferrer"
              );
              break;
            case TYPE_REDELEGATE:
              window.open(
                MULTISIG_REDELEGATE_TEMPLATE,
                "_blank",
                "noopener,noreferrer"
              );
              break;
            default:
              alert("unknown message type");
          }
        }}
      >
        Download template
      </Button>
      <Button
        variant="contained"
        disableElevation
        aria-label="upload file"
        size="small"
        endIcon={<FileUploadOutlinedIcon />}
        sx={{
          mb: 2,
          mt: 2,
          ml: 1,
          textTransform: "none",
        }}
        onClick={() => {
          document.getElementById("multisig_file")!.click();
        }}
      >
        <input
          id="multisig_file"
          accept="*.csv"
          hidden
          type="file"
          onChange={(e: any) => {
            const file = e.target.files[0];
            if (!file) {
              return;
            }

            const reader = new FileReader();
            reader.onload = (e: any) => {
              const contents = e.target.result;
              onFileContents(contents, txType);
            };
            reader.onerror = (e) => {
              alert(e);
            };
            reader.readAsText(file);
            e.target.value = null;
          }}
        />
        Upload csv file
      </Button>
    </Box>
  );
}

export default FileProposalOptions;
