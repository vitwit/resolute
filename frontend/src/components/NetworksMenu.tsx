"use client";

import Image from "next/image";
import React, { useState } from "react";

const NetworksMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div>
      <div
        className="top-nav-options-networks"
        onClick={() => setMenuOpen((menuOpen) => !menuOpen)}
      >
        <div className="flex items-center gap-2">
          <Image
            src="./all-networks-icon.svg"
            width={24}
            height={24}
            alt="All Networks"
          />
          <div className="top-nav-options-networks-currentNetwork">
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
        <div className="networks-menu">
          <ul>
            <div className="network-menu-item network-search">
              <input type="text" placeholder="  Search" />
            </div>
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <li key={index} className="network-menu-item">
                <Image
                  src="./osmosis-logo.svg"
                  width={24}
                  height={24}
                  alt="osmosis"
                />
                <div className="network-name">Osmosis</div>
              </li>
            ))}

            <div className="network-menu-item add-network">
              <Image
                src="./add-network-icon.svg"
                width={24}
                height={24}
                alt="Add Network"
              />
              <div className="network-name">Add Network</div>
            </div>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default NetworksMenu;
