import { useLottie } from 'lottie-react';
import loader from '../../lotties/Loader.json';

const style = {
  height: 400,
  width: '100%',
};

export const Loader = () => {
  const options = {
    animationData: loader,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, style);

  return View;
};
