import React from "react";
import Image from "next/image";

const LogoutPopup = () => {
  return (
    <div className="logout-box">
      <div className="title">
        <h2>Logout</h2>
      </div>
      <div className="logout-image">
        <Image src="/Logout.png" width={100} height={100} alt="Logout" />

        <p className="logout-text">Are you sure you want to Logout.</p>
      </div>
      <div className="flex w-full justify-betwen gap-10">
        <button className="cancel-button">Cancel</button>
        <button className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default LogoutPopup;
