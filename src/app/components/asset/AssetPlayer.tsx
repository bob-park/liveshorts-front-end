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
  const [videoPlayBackRate, setVideoPlayBackRate] = useState<number>(50);

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

  const handleChangePlaybackRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = Number(e.target.value);

    const playbackRate = 0.5 + percent / 100;

    setVideoPlayBackRate(percent);

    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  };

  return (
    <div className="grid grid-cols-1 rounded-xl bg-base-200 p-6 shadow-xl relative">
      <div className="col-span-1"></div>
      <video
        id="asset_video_player"
        className="w-full max-h-screen rounded-xl"
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
          <div className="col-span-1 ">
            <div className="grid grid-cols-3 gap-3 justify-center items-center">
              <div className="col-span-1 text-start">
                <div className="flex gap-2">
                  {/* 재생 버튼 */}
                  <div className="tooltip" data-tip={isPlay ? '정지' : '재생'}>
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
                  </div>
                  {/* 루프 버튼 */}
                  <div className="tooltip" data-tip="반복">
                    <Button
                      className=""
                      type="button"
                      shape="square"
                      active={isLoop}
                      onClick={handleToggleLoop}
                    >
                      <RxLoop className="" />
                    </Button>
                  </div>
                  {/* 배속 버튼 */}
                  <div className="">
                    <div className="tooltip" data-tip="배속">
                      <Button
                        type="button"
                        shape="square"
                        onClick={() =>
                          setShowVideoPlayBackRate(!showVideoPlayBackRate)
                        }
                        active={showVideoPlayBackRate}
                      >
                        {`${0.5 + videoPlayBackRate / 100}x`}
                      </Button>
                    </div>
                    <div
                      className={`w-96 h-20 px-2 bg-slate-900 absolute bottom-20 left-3 z-10 transition-opacity duration-300 rounded-xl shadow-lg ${
                        showVideoPlayBackRate
                          ? 'opacity-100'
                          : 'opacity-0 invisible'
                      }`}
                    >
                      <div className="grid grid-cols-1 justify-center items-center w-full h-full">
                        <div className="mx-3 mt-3">
                          <input
                            className="range range-xs [--range-shdw:none] bg-gray-700 w-full"
                            type="range"
                            min={0}
                            max="100"
                            value={videoPlayBackRate}
                            step="25"
                            onChange={handleChangePlaybackRate}
                          />
                        </div>
                        <div className="w-full flex justify-between text-xs px-2 text-white text-center">
                          <div className="">
                            <div>|</div>
                            <div>0.5x</div>
                          </div>
                          <div className="">
                            <div>|</div>
                            <div>0.75x</div>
                          </div>
                          <div className="">
                            <div>|</div>
                            <div>1x</div>
                          </div>
                          <div className="">
                            <div>|</div>
                            <div>1.25x</div>
                          </div>
                          <div className="">
                            <div>|</div>
                            <div>1.5x</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
