"use client";

import { useEffect, useRef, useState } from "react";

const TEST_ASSET_ID = "20";

export default function EditShorts() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlay, setIsPlay] = useState<boolean>(false);

  // useEffect
  useEffect(() => {
    videoRef.current?.load();
  }, []);

  const handleChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    const currentTime = videoDuration * (value / 100);

    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;

      setVideoProgress(value);
    }
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoDuration(e.currentTarget.duration);
    setVideoProgress(0);
  };

  return (
    <div className="grid grid-rows-[1fr,300px] h-full">
      <div className="grid grid-cols-[300px,1fr] border-b">
        <div className="border-r">작업 패널</div>

        <div className="">
          <video
            controls
            ref={videoRef}
            src={`/api/v1/asset/${TEST_ASSET_ID}/resource?fileType=HI_RES&t=${new Date().getTime}`}
            onTimeUpdate={(e) => setVideoProgress((e.currentTarget.currentTime / videoDuration) * 100)}
            onLoadedMetadataCapture={handleLoadedMetadata}
            onPause={() => setIsPlay(false)}
            onPlay={() => setIsPlay(true)}
            className="w-full"
          ></video>
        </div>
      </div>

      <div className="relative h-full">
        <input
          className="w-full progress bg-neutral-100 h-full rounded-none"
          type="range"
          min={0}
          max={100}
          value={videoProgress}
          defaultValue={0}
          onChange={handleChangeProgress}
        />
        <div className="w-full"></div>
      </div>
    </div>
  );
}
