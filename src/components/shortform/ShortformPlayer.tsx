// react
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// react icons
import { IoPlay, IoPause, IoVolumeMute, IoVolumeHigh } from 'react-icons/io5';

type ShortformPlayerProps = {
  src: string;
};

export default function ShortformPlayer(props: ShortformPlayerProps) {
  // props
  const { src } = props;

  // state
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [isMute, setIsMute] = useState<boolean>(false);
  const [shortFormProgress, setShortFormProgress] = useState<number>(0);
  const [loadedShortFormVideo, setLoadedShortFormVideo] =
    useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);

  // ref
  const shortFormRef = useRef<HTMLVideoElement>(null);

  // useLayoutEffect
  useLayoutEffect(() => {
    setShortFormProgress(0);
    setIsPlay(false);
    setIsMute(false);

    shortFormRef.current?.load();
  }, []);

  // handle
  const handlePlay = () => {
    !isPlay ? shortFormRef.current?.play() : shortFormRef.current?.pause();
  };

  const handleMute = () => {
    if (shortFormRef.current) {
      shortFormRef.current.muted = !isMute;
    }

    setIsMute(!isMute);
  };

  return (
    <div
      className="h-full relative object-contain"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <video
        className="size-full rounded-2xl"
        playsInline
        src={src}
        ref={shortFormRef}
        onTimeUpdate={(e) => {
          setShortFormProgress(
            Math.floor(
              (e.currentTarget.currentTime / e.currentTarget.duration) * 100,
            ),
          );
        }}
        onPlay={() => setIsPlay(true)}
        onPause={() => setIsPlay(false)}
        onLoadedMetadata={(e) => {
          setLoadedShortFormVideo(true);
          e.currentTarget.play();
        }}
      />

      {loadedShortFormVideo && (
        <div className="absolute top-3 left-0 w-full px-4 ">
          <div className="relative w-full h-1 bg-gray-400">
            <div
              className={`absolute top-0 left-0 bg-white h-1 ${
                shortFormProgress === 0 && isPlay
                  ? ''
                  : 'transition-all duration-500 ease-linear'
              }`}
              style={{ width: `${shortFormProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div
        className={`absolute flex justify-between top-0 left-0 size-full rounded-2xl transition-opacity duration-300 ${
          hover
            ? 'opacity-100 bg-gradient-to-b from-black via-transparent to-black'
            : 'opacity-0'
        }`}
      >
        <button
          className="btn btn-sm btn-ghost text-white mt-5 ml-2"
          type="button"
          onClick={handlePlay}
        >
          {isPlay ? (
            <IoPause className="w-5 h-5" />
          ) : (
            <IoPlay className="w-5 h-5" />
          )}
        </button>

        <button
          className="btn btn-sm btn-ghost text-white mt-5 mr-2"
          type="button"
          onClick={handleMute}
        >
          {isMute ? (
            <IoVolumeMute className="w-5 h-5" />
          ) : (
            <IoVolumeHigh className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
