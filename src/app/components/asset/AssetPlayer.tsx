'use client';

// react
import { useCallback, useEffect, useRef, useState } from 'react';

// daisy ui
import { Button } from 'react-daisyui';

// react icons
import {
  IoPlay,
  IoStop,
  IoVolumeHigh,
  IoVolumeMedium,
  IoVolumeLow,
  IoVolumeOff,
  IoVolumeMute,
} from 'react-icons/io5';
import { FaForward, FaBackward } from 'react-icons/fa6';
import { RxLoop } from 'react-icons/rx';
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from 'react-icons/md';

import { secondToTimecode } from '@/utils/common';

type PlayerStatus = 'PLAY' | 'STOP' | 'FORWARD' | 'BACKWARD';

type AssetPlayerProps = {
  src: string;
};

function VolumeIcon(props: { volumeSize: number; mute: boolean }) {
  const { volumeSize, mute } = props;

  if (mute) {
    return <IoVolumeMute className="w-5 h-5" />;
  }

  if (volumeSize > 90) {
    return <IoVolumeHigh className="w-5 h-5" />;
  } else if (volumeSize > 50) {
    return <IoVolumeMedium className="w-5 h-5" />;
  } else if (volumeSize > 20) {
    return <IoVolumeLow className="w-5 h-5" />;
  } else {
    return <IoVolumeOff className="w-5 h-5" />;
  }
}

const PlayerStatusView = (props: {
  status: PlayerStatus;
  currentTime: number;
}) => {
  // props
  const { status, currentTime } = props;

  // state
  const [prevTime, setPrevTime] = useState<number>(0);
  const [show, setShow] = useState<boolean>(true);

  // useEffect
  useEffect(() => {
    return () => {
      setPrevTime(currentTime);
      setShow(false);
    };
  }, [currentTime]);

  useEffect(() => {
    setShow(true);
  }, [prevTime]);

  useEffect(() => {
    console.log(show);
  }, [show]);

  return (
    <div
      className="grid grid-cols-3 w-full h-full justify-center items-center"
      onTransitionEnd={() => console.log('end')}
    >
      {status === 'PLAY' && (
        <>
          <div></div>
          <div className="flex justify-center items-center fade-out">
            <IoPlay className="w-48 h-48" />
          </div>
          <div></div>
        </>
      )}
      {status === 'STOP' && (
        <>
          <div></div>
          <div className="flex justify-center items-center fade-out">
            <IoStop className="w-48 h-48" />
          </div>
          <div></div>
        </>
      )}
      {status === 'FORWARD' && (
        <>
          <div></div>
          <div></div>
          <div
            className={`flex flex-col justify-center items-center ${
              show ? 'fade-out' : 'opacity-100'
            }`}
          >
            <FaForward className="w-48 h-48" />
            <div className="text-center text-xl font-bold">10 seconds</div>
          </div>
        </>
      )}
      {status === 'BACKWARD' && (
        <>
          <div className="flex flex-col justify-center items-center fade-out">
            <FaBackward className="w-48 h-48" />
            <div className="text-center text-xl font-bold">10 seconds</div>
          </div>
          <div></div>
          <div></div>
        </>
      )}
    </div>
  );
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
  const [volume, setVolume] = useState<number>(100);
  const [mute, setMute] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>('STOP');
  const [updatePlayerStatusTime, setUpdatePlayerStatusTime] =
    useState<number>(0);

  // useEffect
  useEffect(() => {
    const player = document.getElementById('asset_video_player');

    player?.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    });
  }, []);

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

  const handleChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volumeSize = Number(e.target.value);

    setVolume(volumeSize);

    if (videoRef.current) {
      videoRef.current.volume = volumeSize / 100;
    }
  };

  const handleMute = (muted: boolean) => {
    setMute(muted);

    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  };

  const handleFullScreen = (fullScreen: boolean) => {
    setIsFullScreen(fullScreen);

    const player = document.getElementById('asset_video_player');

    if (player) {
      fullScreen ? player.requestFullscreen() : document.exitFullscreen();
    }
  };

  const handlePlayerKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    e.preventDefault();

    if (videoRef.current) {
      if (e.key === 'ArrowRight') {
        videoRef.current.currentTime += 10;
        setPlayerStatus('FORWARD');
      } else if (e.key === 'ArrowLeft') {
        videoRef.current.currentTime -= 10;
        setPlayerStatus('BACKWARD');
      } else if (e.key === ' ') {
        const paused = videoRef.current.paused;

        paused ? videoRef.current.play() : videoRef.current.pause();
      }

      setUpdatePlayerStatusTime(new Date().getTime());
    }
  };

  return (
    <div
      id="asset_video_player"
      className={`grid grid-cols-1 h-full rounded-xl bg-base-200 p-6 shadow-xl relative`}
      tabIndex={-1}
      onKeyDown={handlePlayerKeyDown}
    >
      <div className="col-span-1 h-full">
        <div className="flex justify-center items-center">
          <video
            id=""
            className={`w-full min-h-max ${
              isFullScreen
                ? 'max-h-[calc(100lvh-10rem)]'
                : 'max-h-[calc(100lvh-25rem)]'
            } object-contain rounded-xl`}
            ref={videoRef}
            src={src}
            onLoadedMetadataCapture={handleLoadedMetadata}
            onTimeUpdate={(e) =>
              setVideoProgress(
                (e.currentTarget.currentTime / videoDuration) * 100,
              )
            }
            onPause={(e) => {
              setIsPlay(false);
              setPlayerStatus('STOP');
            }}
            onPlay={(e) => {
              setIsPlay(true);
              setPlayerStatus('PLAY');
            }}
          />
          <div className="w-full h-full absolute">
            {/* <PlayerStatusView
              status={playerStatus}
              currentTime={updatePlayerStatusTime}
            /> */}
          </div>
        </div>
      </div>

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
              min="0"
              value={videoProgress}
              onChange={handleChangeProgress}
            />
          </div>
          <div className="col-span-1">
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
                    <div className="flex h-full items-center">
                      <div
                        className="tooltip"
                        data-tip={mute ? '음소거 해제' : '음소거'}
                      >
                        <Button
                          className=""
                          type="button"
                          onClick={() => handleMute(!mute)}
                        >
                          <VolumeIcon mute={mute} volumeSize={volume} />
                        </Button>
                      </div>
                      <div className="w-20 mt-[4px] ">
                        <input
                          className="range range-xs"
                          type="range"
                          min={0}
                          max="100"
                          value={mute ? 0 : volume}
                          onChange={handleChangeVolume}
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
              <div className="col-span-1 text-right">
                <div className="flex justify-end gap-3">
                  <div>
                    <div
                      className="tooltip"
                      data-tip={isFullScreen ? '전체화면 종료' : '전체화면'}
                    >
                      <Button
                        className=""
                        type="button"
                        onClick={() => handleFullScreen(!isFullScreen)}
                      >
                        {isFullScreen ? (
                          <MdOutlineFullscreenExit className="w-5 h-5" />
                        ) : (
                          <MdOutlineFullscreen className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
