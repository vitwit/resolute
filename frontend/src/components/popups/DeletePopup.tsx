import React from "react";
import Image from "next/image";

const DeletePopup = () => {
  return (
    <div className="rectangle-box flex-col">
      <div className="heading">
        <h2>Delete</h2>
      </div>
      <div className="delete-image">
        <Image src="/Delete.png" width={100} height={100} alt="Delete" />
        <p className="text">
          Are you sure you want to delete ? you cannot undo this action.
        </p>
      </div>
      <div className=" flex w-full justify-between">
        <button className="cancel-button">Cancel</button>

        <button className="cancel-button">Continue</button>
      </div>
    </div>
  );
};

export default DeletePopup;
