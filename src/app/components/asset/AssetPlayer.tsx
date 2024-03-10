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
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  // useEffect
  useEffect(() => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;

      setVideoDuration(duration);

      videoRef.current.addEventListener('timeupdate', () => {
        const currentTime = videoRef.current?.currentTime || 0;

        const progress = currentTime / duration;

        setVideoProgress(progress * 100);
      });

      videoRef.current.addEventListener('play', () => {
        setIsPlay(true);
      });

      videoRef.current.addEventListener('pause', () => {
        setIsPlay(false);
      });
    }
  }, [videoRef.current]);

  // handle
  const handlePlay = () => {
    !isPlay ? videoRef.current?.play() : videoRef.current?.pause();
  };

  const handleChangeProgress = (e: React.MouseEvent<HTMLProgressElement>) => {
    const width = e.currentTarget.offsetWidth;
    const value = (e.pageX - e.currentTarget.offsetLeft) / width;

    const currentTime = videoDuration * value;

    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;

      setVideoProgress(value * 100);
    }
  };

  return (
    <div className="grid grid-cols-1 rounded-xl bg-base-200 p-6 shadow-xl">
      <div className="col-span-1"></div>
      <video className="w-full h-full" ref={videoRef} src={src} controls />
      <div className="col-span-1">
        <div className="grid grid-cols-1">
          <div className="col-span-1">
            <progress
              className="progress w-full"
              max={100}
              value={videoProgress}
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
                  >
                    {isPlay ? (
                      <IoStop className="w-5" />
                    ) : (
                      <IoPlay className="w-5" />
                    )}
                  </Button>
                  {/* 루프 버튼 */}
                  <Button type="button" shape="square">
                    <RxLoop className="" />
                  </Button>
                  {/* 배속 버튼 */}
                  <Button type="button" shape="square">
                    1x
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
