import React from 'react';
import Image from 'next/image';

const Landingpage = () => {
  return (
    <div>
      <div className="flex justify-center items-center gap-2.5 p-2.5"></div>

      <div className="flex items-center gap-10 pl-20 py-0 ">
        <div className="space-y-40">
          <Image
            src="/vitwit-logo-main.png"
            width={180}
            height={475}
            alt="Vitwit-Logo"
          />
          <div className="flex flex-col space-y-6">
            <div className="flex text-white text-center text-[100px] not-italic font-extrabold leading-[100px] tracking-[7px]">
              Resolute
            </div>
            <div className="flex flex-col space-y-10">
              <div className="flex flex-col space-y-2 w-[512px]">
                <div className="text-white text-[28px] not-italic font-light">
                  Interface Interchain
                </div>
                <div className="text-white text-lg font-thin leading-normal">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididun.
                </div>
              </div>
              <div className="flex w-[220px] justify-center items-center gap-6 px-10 py-6 rounded-[100px] border-2 border-solid border-[#4AA29C] cursor-pointer">
                <p className="text-white text-lg not-italic font-bold">
                  Connect Wallet
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* w-[682px] h-[356px] absolute left-[521px] top-[38px] */}
     
          <Image
          src="/background-circle.png"
          width={682}
          height={356}
          alt="background-circle"
          />

        
        <div className="flex justify-end w-full">
          <div className="flex absolute  mt-20">
            <video width={600} height={500} controls loop muted autoPlay>
              <source src="/video.mp4" type="video/mp4" />
            </video>
          </div>
          <Image
            src="/landingpage.png"
            width={975}
            height={500}
            alt="landing page image"
          />
        </div>
      </div>
      <div className="flex mb-36"></div>
      <div className="powered-by-background">
        <div className="flex justify-center items-center gap-2.5 p-2.5">
          <div className="powered-by text">Powered by VitWit</div>
        </div>
      </div>
    </div>
  );
};

export default Landingpage;
