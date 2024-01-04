import { useEffect, useState } from 'react';

const useAssetsCardNumber = () => {
  const getCardsCountWithScreenSize = () => {
    // the width's given below are not standard division, but tested with this specific use case
    const width = window.innerWidth || 1550;

    // Todo: something wrong with 5 assets, sometimes it's showing column wise
    //if (width >= 1760) return 5;
    if (width >= 1550) return 4;
    if (width >= 1250) return 3;
    return 2;
  };

  const [cardsCount, setCardsCount] = useState(getCardsCountWithScreenSize());

  const resetCardsNumber = () => {
    setCardsCount(getCardsCountWithScreenSize());
  };

  useEffect(() => {
    window.addEventListener('resize', resetCardsNumber);
    return () => {
      window.removeEventListener('resize', resetCardsNumber);
    };
  }, []);

  return cardsCount;
};

export default useAssetsCardNumber;
