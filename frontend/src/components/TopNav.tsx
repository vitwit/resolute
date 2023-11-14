"use clinet"
import Image from "next/image";
import React from "react";

const TopNav = () => {
  return (
    <div className="flex justify-between items-center mb-10">
      <h2 className="text-md text-white font-medium">Overview</h2>
      <div className="flex gap-10">
        <Image src="/history-icon.svg" height={40} width={40} alt="History" />
        <Image src="/logout-icon.svg" height={40} width={40} alt="Logout" />
      </div>
    </div>
  );
};

export default TopNav;