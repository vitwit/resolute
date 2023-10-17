import React from 'react'
import Image from 'next/image'

const  GroupsCards = () => {
  const groupData = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className='group-grid'>
      {groupData.map((index: number, id: number) =>(
        <div className='group-grid-card ' key={id}>
        <div className='group-title'>
            <Image src="/GroupImage.png" width={32} height={32} alt="Groupimage" />
            <div className='titlegrp'>Group Name</div>
            <div className='end-title'>Est. 2023-09</div>
        </div>
        <div className='group-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
        <div className='group-head'>
          <div className='headg'>
              <div className='headg-first'>Version</div>
              <div className='headg-second'>1</div>    
          </div>
          <div className='head2g'>
            <div className='head2g-first'>Total Weight</div>
            <div className='head2g-second'>2</div>
          </div>
        </div>
        <div className='Groupbuttons'>
          <div className='viewbutton'>View</div>
          <div className='leavebutton'>Leave</div>
        </div>
      </div>
        ))}
    </div>
  );
};

export default GroupsCards;