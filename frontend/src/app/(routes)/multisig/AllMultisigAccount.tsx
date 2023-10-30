import React from 'react';
import Image from 'next/image';
import "./style.css"

const AllMultisigAccount = () => {
    const multisigData = [1,2,3,4];
  return (
    <div className='multisig-grid'>
        {multisigData.map((index: number, id: number)=>(
      <div className='multisig' key={id} >
        <div className='multisig-details'>
          <div className='multisig-first'>Name</div>
          <div className='multisig-second'>Multisign Transaction name</div>
        </div>
        <div className="v-line"></div>
        <div className='multisig-details'>
          <div className='multisig-first'>Address</div>
          <div className='flex'>
            <div className='multisig-second'>cosmos1enruju0dnejv8v..</div>
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
        <div className='multisig-details'>
          <div className='multisig-first'>Threshold</div>
          <div className='multisig-second'>2</div>
        </div>
        <div className="v-line"></div>
        <div className='multisig-details'>
          <div className='multisig-first'>Actions Required</div>
          <div className='multisig-second'>2 Txns</div>
        </div>
        <div className="v-line"></div>
        <div className='multisig-details'>
          <div className='multisig-first'>Created At</div>
          <div className='multisig-second'>2023-08-24 10:34:43</div>
        </div>
      </div>
      ))}
    </div>
  );
};

export default AllMultisigAccount;