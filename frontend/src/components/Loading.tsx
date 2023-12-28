import React from 'react';

const Loading = () => {
  return (
    <div className="landingpage-background text-white min-h-screen min-w-full flex justify-center items-center">
      <div className="flex">
        <div>loading</div>
        <div className="dots-flashing"></div>
      </div>
    </div>
  );
};

export default Loading;
