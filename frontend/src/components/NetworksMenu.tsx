"use client";

import Image from "next/image";
import React, { useState } from "react";

const NetworksMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  return (
    <div>
      <div
        className="topNav__options__networks"
        onClick={() => setMenuOpen((menuOpen) => !menuOpen)}
      >
        <div className="flex items-center gap-2">
          <Image
            src="./all-networks-icon.svg"
            width={24}
            height={24}
            alt="All Networks"
          />
          <div className="topNav__options__networks__currentNetwork">
            All Networks
          </div>
        </div>
        <div>
          <Image
            src="./down-arrow-icon.svg"
            width={24}
            height={24}
            alt="Select Network"
          />
        </div>
      </div>
      {menuOpen ? (
        <div className="networksMenu">
          <ul>
            <div className="networkItem networkSearch">
              <input type="text" placeholder="  Search" />
            </div>
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <li key={index} className="networkItem">
                <Image
                  src="./osmosis-logo.svg"
                  width={24}
                  height={24}
                  alt="osmosis"
                />
                <div className="networkName">Osmosis</div>
              </li>
            ))}

            <div className="networkItem addNetwork">
              <Image
                src="./add-network-icon.svg"
                width={24}
                height={24}
                alt="Add Network"
              />
              <div className="networkName">Add Network</div>
            </div>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default NetworksMenu;
