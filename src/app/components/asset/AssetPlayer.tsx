'use client';

// react
import { ChangeEvent, useEffect, useRef, useState } from 'react';

// daisy ui
import { Button, Progress } from 'react-daisyui';

// react icons
import {
  IoPlay,
  IoStop,
  IoVolumeHigh,
  IoVolumeMedium,
  IoVolumeLow,
  IoVolumeOff,
} from 'react-icons/io5';
import { RxLoop } from 'react-icons/rx';
import { secondToTimecode } from '@/utils/common';

type AssetPlayerProps = {
  src: string;
};

export default function AssetPlayer(props: AssetPlayerProps) {
  // props
  const { src } = props;

  // ref
  const videoRef = useRef<HTMLVideoElement>(null);

  // state
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [isLoop, setIsLoop] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [showVideoPlayBackRate, setShowVideoPlayBackRate] =
    useState<boolean>(false);
  const [videoPlayBackRate, setVideoPlayBackRate] = useState<number>(1);

  // useEffect
  useEffect(() => {}, [videoRef.current]);

  // handle
  const handlePlay = () => {
    !isPlay ? videoRef.current?.play() : videoRef.current?.pause();
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    e.currentTarget.play();
    setVideoDuration(e.currentTarget.duration);
  };

  const handleChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    const currentTime = videoDuration * (value / 100);

    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;

      setVideoProgress(value);
    }
  };

  const handleToggleLoop = () => {
    setIsLoop(!isLoop);

    if (videoRef.current) {
      videoRef.current.loop = !isLoop;
    }
  };

  return (
    <div className="grid grid-cols-1 rounded-xl bg-base-200 p-6 shadow-xl ">
      <div className="col-span-1"></div>
      <video
        id="asset_video_player"
        className="w-full max-h-[600px]"
        ref={videoRef}
        src={src}
        onLoadedMetadataCapture={handleLoadedMetadata}
        onTimeUpdate={(e) =>
          setVideoProgress((e.currentTarget.currentTime / videoDuration) * 100)
        }
        onPause={(e) => setIsPlay(false)}
        onPlay={(e) => setIsPlay(true)}
      />
      <div className="col-span-1">
        <div className="grid grid-cols-1">
          <div className="col-span-1 py-3 relative">
            <progress
              className="progress w-full"
              max={100}
              value={videoProgress}
            />
            <input
              className="range w-full transition opacity-0 hover:opacity-100 absolute top-3 left-0"
              type="range"
              max="100"
              value={videoProgress}
              onChange={handleChangeProgress}
            />
          </div>
          <div className="col-span-1">
            <div className="grid grid-cols-3 gap-3 justify-center items-center">
              <div className="col-span-1 text-start">
                <div className="flex gap-2">
                  {/* 재생 버튼 */}
                  <Button
                    className=""
                    type="button"
                    shape="square"
                    onClick={handlePlay}
                    active={isPlay}
                  >
                    {isPlay ? (
                      <IoStop className="w-5" />
                    ) : (
                      <IoPlay className="w-5" />
                    )}
                  </Button>
                  {/* 루프 버튼 */}
                  <Button
                    className=""
                    type="button"
                    shape="square"
                    active={isLoop}
                    onClick={handleToggleLoop}
                  >
                    <RxLoop className="" />
                  </Button>
                  {/* 배속 버튼 */}
                  <Button type="button" shape="square">
                    {`${videoPlayBackRate}x`}
                  </Button>
                  <div className="col-span-2">
                    <div className="flex items-center">
                      <Button type="button" color="ghost">
                        <IoVolumeHigh className="" />
                      </Button>
                      <div className="w-16">
                        <input
                          className="range range-xs"
                          type="range"
                          min={0}
                          max="100"
                          defaultValue="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-black">
                  {secondToTimecode(videoRef.current?.currentTime || 0)}
                </span>
                <span> / </span>
                <span className="font-semibold text-gray-500">
                  {secondToTimecode(videoDuration)}
                </span>
              </div>
              <div className="col-span-1 text-right">화질 비디오 크기 등등</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
