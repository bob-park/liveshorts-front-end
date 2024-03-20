"use client";

import { useEffect, useRef, useState } from "react";
import AssetPlayer from "@/app/components/asset/AssetPlayer";

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
    // e.currentTarget.play();
    setVideoDuration(e.currentTarget.duration);
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
            onPause={(e) => setIsPlay(false)}
            onPlay={(e) => setIsPlay(true)}
            className="w-full"
          ></video>
        </div>
      </div>

      <div className="relative">
        {/* <progress className="progress w-full" max={100} value={videoProgress} /> */}

        <input className="w-full" type="range" max="100" value={videoProgress} onChange={handleChangeProgress} />
        {/* <input
          className="range w-full rounded-none transition opacity-0 hover:opacity-100 absolute top-3 left-0"
          type="range"
          max="100"
          value={videoProgress}
          onChange={handleChangeProgress}
        /> */}
      </div>
    </div>
  );
}
