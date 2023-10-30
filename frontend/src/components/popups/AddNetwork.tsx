"use client";
import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Button, Dialog, DialogContent } from "@mui/material";
import CustomTabsGroup from "../CustomTabsGroup";

const AddNetwork = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const [tab, setTab] = useState(0);
  const ADD_NETWORK_TEMPLATE: string = "";

  const handleTabChange = (value: number) => {
    setTab(value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("here...");
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result as string;
      onFileContents(contents);
    };
    reader.onerror = (e) => {
      alert(e);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const onFileContents = (content: string): void => {
    console.log(content);
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="lg"
      className="blur-effect"
      PaperProps={{ sx: { borderRadius: "16px", backgroundColor: "#20172F" } }}
    >
      <DialogContent sx={{ px: 3, py: 5 }}>
        <div className="add-network-dialog flex-col gap-10">
          <div className="popup-title">
            <h2>Add Network</h2>
            <div className="dialog-close-icon" onClick={handleClose}>
              <Image src="/close.svg" width={40} height={40} alt="close" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-10">
            <CustomTabsGroup
              handleTabChange={handleTabChange}
              tabs={[
                { title: "Local", disabled: false },
                { title: "Request", disabled: false },
              ]}
            />
            <div className="w-full">
              <div
                className="upload-file-box"
                onClick={() => {
                  document.getElementById("multisig_file")!.click();
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="./upload-icon.svg"
                    width={60}
                    height={60}
                    alt="Upload file"
                  />
                  <div className="mt-2">Upload file here</div>
                </div>
                <input
                  id="multisig_file"
                  accept=".json"
                  hidden
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
              <div className="mt-3">
                Download sample JSON file&nbsp;
                <a
                  className="add-network-json-sample-link"
                  onClick={() => {
                    window.open(
                      ADD_NETWORK_TEMPLATE,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                >
                  here
                </a>
              </div>
            </div>
            <div className="w-full">
                <button className="custom-btn w-full">Add Network</button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNetwork;
