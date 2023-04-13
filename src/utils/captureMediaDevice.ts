export const captureMediaDevice = ({
  audio,
  video,
  callBack,
}: {
  audio: boolean;
  video: boolean;
  callBack: {
    success: () => void;
    error: (error: string) => void;
  };
}) => {
  navigator.mediaDevices
    .getUserMedia({ audio, video })
    .then((stream) => {
      callBack.success();
      stream.getTracks().forEach((mst) => mst.stop());
    })
    .catch((error) => {
      if (video) return captureMediaDevice({ video: false, audio: true, callBack });
      if (error) callBack.error(String(error));
    });
};
