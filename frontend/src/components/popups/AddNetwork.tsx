"use client";
import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { ValidationError, validate } from "jsonschema";
import CustomTabsGroup from "../CustomTabsGroup";
import ClearIcon from "@mui/icons-material/Clear";
import networkConfigFormat from "../../utils/networkConfigFormat.json";
import { useSelector } from "react-redux";
import _ from "lodash";

const AddNetwork = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  //TODO: Add url and store is contants file
  const ADD_NETWORK_TEMPLATE: string = "";

  const [tab, setTab] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [chainIDExist, setChainIDExist] = useState<boolean>(false);
  const [chainNameExist, setChainNameExist] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [networkConfig, setNetworkConfig] = useState<Network | {}>({});

  const nameToChainIDs = useSelector(
    (state: any) => state.wallet.nameToChainIDs
  );

  const handleTabChange = (value: number) => {
    setTab(value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result as string;
      onFileContents(contents);
      setUploadedFileName(file.name);
    };
    reader.onerror = (e) => {
      alert(e);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const onFileContents = (content: string): void => {
    try {
      const parsedData = JSON.parse(content);
      const res = validate(parsedData, networkConfigFormat);
      setValidationErrors(res.errors);
      if (!_.get(res, "errors.length")) {
        setChainNameExist(
          chainNameExists(_.get(parsedData, "config.chain_name"))
        );
        setChainIDExist(chainIDExists(_.get(parsedData, "config.chain_id")));
        setNetworkConfig(parsedData);
      } else {
        setNetworkConfig({});
      }
    } catch (e) {
      setNetworkConfig({});
      console.log(e);
    }
  };

  const chainNameExists = (chainName: string) => {
    const chainNamesList = Object.keys(nameToChainIDs);
    if (chainNamesList.includes(chainName.toLowerCase())) {
      return true;
    }
    return false;
  };

  const chainIDExists = (chainID: string) => {
    const chainNamesList = Object.keys(nameToChainIDs);
    for (let chain in chainNamesList) {
      if (
        nameToChainIDs[chainNamesList[chain]].toLowerCase() ===
        chainID.toLowerCase()
      ) {
        return true;
      }
    }
    return false;
  };

  const addNetwork = () => {
    console.log(networkConfig);
  };

  return (
    <Dialog
      open={open}
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
                  {uploadedFileName ? (
                    <>
                      <div className="font-bold text-">
                        {uploadedFileName}{" "}
                        <IconButton
                          aria-label="delete txn"
                          color="error"
                          sx={{
                            mt: 2,
                            mb: 2,
                          }}
                          onClick={(e) => {
                            setUploadedFileName("");
                            setChainIDExist(false);
                            setChainNameExist(false);
                            setShowErrors(false);
                            e.stopPropagation();
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <Image
                        src="./upload-icon.svg"
                        width={60}
                        height={60}
                        alt="Upload file"
                      />
                      <div className="mt-2">Upload file here</div>
                    </>
                  )}
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
            {uploadedFileName && validationErrors?.length ? (
              <div className="w-full">
                <div className="flex gap-4">
                  <div className="text-red-600 font-bold">
                    Invalid json file
                  </div>
                  <div
                    className="underline underline-offset-2 cursor-pointer text-[12px]"
                    onClick={() => setShowErrors((showErrors) => !showErrors)}
                  >
                    show more
                  </div>
                </div>
                {showErrors &&
                  validationErrors?.map((item, index) => (
                    <li key={index}>{item.stack}</li>
                  ))}
              </div>
            ) : (
              <div>
                {chainNameExist ? (
                  <div className="text-red-600 font-bold">
                    Chain already exist with the given chain_name
                  </div>
                ) : (
                  <></>
                )}
                {chainIDExist ? (
                  <div className="text-red-600 font-bold">
                    Chain already exist with the given chain_id
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}
            <div className="w-full">
              <button
                className="custom-btn w-full"
                onClick={() => addNetwork()}
              >
                Add Network
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNetwork;
