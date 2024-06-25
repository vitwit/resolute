import React from 'react';

const DelegationsLoading = () => {
  return (
    <div>
      {[1, 2].map((_, index) => (
        <div key={index} className="px-6 py-0">
          <div className="flex justify-between w-full mb-4">
            <div className="flex space-x-4">
              <div className="space-x-2 flex justify-center items-center">
                <div className="w-10 h-10 rounded-full bg-[#252525]" />
                <div className="h-8 w-32 rounded bg-[#252525] animate-pulse" />
                <div className="h-8 w-32 rounded-full bg-[#252525] animate-pulse" />
              </div>
            </div>
          </div>
          {[1, 2].map((_, id) => (
            <div
              key={id}
              className="h-20 my-4 w-full rounded bg-[#252525] animate-pulse"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DelegationsLoading;
