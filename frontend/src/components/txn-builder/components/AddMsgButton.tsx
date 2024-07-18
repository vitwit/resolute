import React from 'react';

interface AddMsgButtonProps {
  fileUploadTxns: Msg[];
  handleAddMsgs: (msg: Msg[]) => void;
  onRemoveFileUploadTxns: () => void;
}

const AddMsgButton = (props: AddMsgButtonProps) => {
  const { fileUploadTxns, handleAddMsgs, onRemoveFileUploadTxns } = props;

  return (
    <button
      type={fileUploadTxns?.length ? 'button' : 'submit'}
      className="primary-btn w-full"
      onClick={(e) => {
        if (fileUploadTxns?.length) {
          handleAddMsgs(fileUploadTxns);
          onRemoveFileUploadTxns();
          e.preventDefault();
        }
      }}
    >
      Add
    </button>
  );
};

export default AddMsgButton;
