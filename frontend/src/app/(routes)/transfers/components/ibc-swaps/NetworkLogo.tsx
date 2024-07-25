import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getFAC } from '@/utils/util';
import React, { useEffect, useRef, useState } from 'react';

const NetworkLogo = ({ logo, chainID }: { logo: string; chainID: string }) => {
  const { getNetworkTheme } = useGetChainInfo();
  const { primaryColor = '' } = getNetworkTheme(chainID);
  const imgRef = useRef<HTMLImageElement>(null);
  const [blurColor, setBlurColor] = useState<string>('#4453DF');
  const [error, setError] = useState(false);
  const fac = getFAC();
  useEffect(() => {
    const getColor = async () => {
      if (imgRef.current) {
        try {
          const color = await fac.getColorAsync(imgRef.current);
          setBlurColor(color.hex);
        } catch (error) {
          setError(true);
        }
      }
    };

    getColor();

    return () => {
      fac.destroy();
    };
  }, [logo]);
  return (
    <div className="network-image-container">
      {error ? (
        <>
          <div
            className="blur-background"
            style={{ backgroundColor: primaryColor || blurColor }}
          ></div>
          <div className="circle-background">
            <img ref={imgRef} src={logo} alt={''} className="network-image" />
          </div>
        </>
      ) : (
        <>
          <div
            className="blur-background"
            style={{ backgroundColor: primaryColor || blurColor }}
          ></div>
          <div className="circle-background">
            <img
              ref={imgRef}
              src={logo}
              alt={''}
              className="network-image"
              crossOrigin="anonymous"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NetworkLogo;

