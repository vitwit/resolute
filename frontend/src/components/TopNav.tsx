'use client'
import Image from "next/image";
import React from "react";
import NetworksMenu from "./NetworksMenu";

const TopNav = ({pathname}:{pathname:string}) => {
  return (
    <div className="topNav">
      <div className="topNav__title">
        <h2>{pathname}</h2>
      </div>
      <div className="topNav__options">
          <NetworksMenu />
        <div className="topNav__options__logout">
          <Image src="./logout-icon.svg" width={40} height={40} alt="Logout" />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
