import React from "react";
import Multisig from "staking/components/tabs/Multisg";
import FileUploadForm from "./FileUploadForm";

const page = () => {
  return (
    <div className="page">
      <Multisig />
      <FileUploadForm />
    </div>
  );
};

export default page;
