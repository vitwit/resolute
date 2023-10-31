import React from "react";
import Image from "next/image";

function AllMultisiggrid() {
  return (
    <div className="all-multisig-grid">
      <div className="space-y-6">
        <div className="multisig-grid-1">
          <div className="multisig-details">
            <div className="multisig-first">Name</div>
            <div className="multisig-second">Multisign Transaction name</div>
          </div>
          <div className="v-line"></div>
          <div className="multisig-details">
            <div className="multisig-first">Address</div>
            <div className="flex">
              <div className="multisig-second">cosmos1enruju0dnejv8v..</div>
              <Image
                src="/copy.svg"
                width={24}
                height={24}
                alt="copy address.."
                className="cursor-pointer"
              ></Image>
            </div>
          </div>
          <div className="v-line"></div>
          <div className="multisig-details">
            <div className="multisig-first">Threshold</div>
            <div className="multisig-second">2</div>
          </div>
          <div className="v-line"></div>
          <div className="multisig-details">
            <div className="multisig-first">Actions Required</div>
            <div className="multisig-second">2 Txns</div>
          </div>
          <div className="v-line"></div>
          <div className="multisig-details">
            <div className="multisig-first">Created At</div>
            <div className="multisig-second">2023-08-24 10:34:43</div>
          </div>
        </div>
        <div className="multisig-grid-2">
          <div className="multisig-details">
            <div className="multisig-first">Available Atoms</div>
            <div className="multisig-second">O ATOMS</div>
          </div>
          <div className="v-line"></div>
          <div className="multisig-details">
            <div className="multisig-first">Staked</div>
            <div className="multisig-second">0.0000000ATOMS</div>
          </div>
          <div className="v-line"></div>
        </div>
        <div className="multisig-grid-3">
          <div className="multisig-details">
            <div className="multisig-first">Members</div>
            <div className="flex gap-4">
              <div className="flex">
                <div className="multisig-second">cosmos1enr...</div>
                <Image
                  src="./copy.svg"
                  width={24}
                  height={24}
                  alt="copy-logo"
                  className="cursor-pointer"
                />
              </div>
              <div className="flex ">
                <div className="multisig-second">cosmos1enr...</div>
                <Image
                  src="./copy.svg"
                  width={24}
                  height={24}
                  alt="copy-logo"
                  className="cursor-pointer"
                />
              </div>
              <div className="flex ">
                <div className="multisig-second">cosmos1enr...</div>
                <Image
                  src="./copy.svg"
                  width={24}
                  height={24}
                  alt="copy-logo"
                  className="cursor-pointer"
                />
              </div>
              <div className="flex ">
                <div className="multisig-second">cosmos1enr...</div>
                <Image
                  src="./copy.svg"
                  width={24}
                  height={24}
                  alt="copy-logo"
                  className="cursor-pointer"
                />
              </div>
              <div className="flex ">
                <div className="multisig-second">cosmos1enr...</div>
                <Image
                  src="./copy.svg"
                  width={24}
                  height={24}
                  alt="copy-logo"
                  className="cursor-pointer"
                />
              </div>
              <div className="flex ">
                <div className="multisig-second">cosmos1enr...</div>
                <Image
                  src="./copy.svg"
                  width={24}
                  height={24}
                  alt="copy-logo"
                  className="cursor-pointer"
                />
              </div>
              <div className="flex ">
                <div className="multisig-second">cosmos1enr...</div>
                <Image
                  src="./copy.svg"
                  width={24}
                  height={24}
                  alt="copy-logo"
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllMultisiggrid;
