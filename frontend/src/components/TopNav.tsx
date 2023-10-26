"use client";
import Image from "next/image";
import React from "react";
import NetworksMenu from "./NetworksMenu";
import { useRouter } from "next/navigation";
import { logout } from "../utils/localStorage";
import { useDispatch } from "react-redux";
import { resetWallet } from "../store/features/wallet/walletSlice";

const TopNav = ({ pathname }: { pathname: string }) => {
  const dispatch = useDispatch();
  return (
    <div className="top-nav">
      <div className="top-nav-title">
        <h2>{pathname}</h2>
      </div>
      <div className="top-nav-options">
        <NetworksMenu />
        <div>
          <Image
            onClick={() => {
              logout();
              dispatch(resetWallet());
            }}
            className="cursor-pointer"
            src="./logout-icon.svg"
            width={40}
            height={40}
            alt="Logout"
          />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
