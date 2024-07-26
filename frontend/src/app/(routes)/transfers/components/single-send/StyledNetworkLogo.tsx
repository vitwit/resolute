import { getFAC } from '@/utils/util';
import React, { useEffect, useRef, useState } from 'react';

const StyledNetworkLogo = ({
  logo,
  primaryColor,
  rotate,
}: {
  logo: string;
  primaryColor: string;
  rotate?: boolean;
}) => {
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
              className={`network-image ${rotate ? 'animate-rotate-x' : ''}`}
              crossOrigin="anonymous"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default StyledNetworkLogo;
