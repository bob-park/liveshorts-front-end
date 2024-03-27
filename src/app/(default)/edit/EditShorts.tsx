"use client";

import { useEffect, useRef, useState } from "react";
import { FaMagnifyingGlassPlus, FaMagnifyingGlassMinus } from "react-icons/fa6";

const TEST_ASSET_ID = "20";
const MAX_PERCENT = 200;
const MIN_PERCENT = 100;

export default function EditShorts() {
  // useRef
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const sectionBoxRef = useRef<HTMLDivElement>(null);
  const startPositionX = useRef<number | null>(null);
  const prevPositionX = useRef<number>(0);
  const prevProgressWidth = useRef<number>(0);

  // useState
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [positionX, setPositionX] = useState<number>(0);
  const [section, setSection] = useState({ startTime: positionX, endTime: positionX + 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [progressWidthPercent, setProgressWidthPercent] = useState(MIN_PERCENT);

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

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isDragging && startPositionX.current !== null && progressRef.current) {
        const ProgressWidth = progressRef.current.clientWidth;
        const sectionBoxWidth = sectionBoxRef.current!.clientWidth;
        const newDivX = e.clientX - startPositionX.current;
        const maxX = ProgressWidth - sectionBoxWidth;

        const newX = Math.max(0, Math.min(maxX, newDivX));

        setPositionX(newX);
        prevPositionX.current = newX;
      }
    }

    function handleMouseUp() {
      setIsDragging(false);
      startPositionX.current = null;
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  prevProgressWidth.current = progressRef.current?.clientWidth ?? 0;

  useEffect(() => {
    function handleWindowResize() {
      if (progressRef.current && sectionBoxRef.current) {
        const progressWidth = progressRef.current.clientWidth;
        const sectionBoxWidth = sectionBoxRef.current.clientWidth;

        const resizeRatio = progressWidth / prevProgressWidth.current;
        const maxX = progressWidth - sectionBoxWidth;

        const newX = Math.max(0, Math.min(maxX, positionX * resizeRatio));

        setPositionX(newX);
        prevPositionX.current = newX;
      }
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (progressRef.current && sectionBoxRef.current) {
      const progressWidth = progressRef.current.clientWidth;
      const sectionBoxWidth = sectionBoxRef.current.clientWidth;

      const maxX = progressWidth - sectionBoxWidth;

      const newX = Math.max(0, Math.min(maxX, (prevPositionX.current * progressWidthPercent) / 100));
      setPositionX(newX);
    }
  }, [progressWidthPercent]);

  useEffect(() => {
    setSection({ startTime: positionX, endTime: positionX + 600 });
  }, [positionX]);

  function expandProgress() {
    setProgressWidthPercent((prev) => (prev === MAX_PERCENT ? prev : prev + 25));
  }

  function shrinkProgress() {
    setProgressWidthPercent((prev) => (prev === MIN_PERCENT ? prev : prev - 25));
  }

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoDuration(e.currentTarget.duration);
    setVideoProgress(0);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);

    startPositionX.current = e.clientX - positionX;
  };

  return (
    <div className="grid grid-rows-[1fr,300px]">
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

      <div className="grid grid-rows-[50px,50px,200px] overflow-x-scroll">
        <div className="flex items-center">
          <span>{progressWidthPercent}%</span>

          <button onClick={expandProgress} className="w-10">
            <FaMagnifyingGlassPlus className="w-8" />
          </button>
          <button onClick={shrinkProgress} className="w-10">
            <FaMagnifyingGlassMinus />
          </button>
        </div>

        <div>줄자</div>

        <div
          ref={progressRef}
          style={{ width: `${progressWidthPercent}%` }}
          className="relative bg-neutral-50 bg-opacity-25"
        >
          <div className="w-full h-1/4 bg-neutral-50 absolute top-1/4 border-t border-neutral-500">bgm</div>
          <div className="w-full h-1/4 bg-neutral-50 absolute top-2/4 border-t border-neutral-500">title</div>
          <div className="w-full h-1/4 bg-neutral-50 absolute top-3/4 border-t border-neutral-500">subtitle</div>
          <input
            className="w-full progress h-full rounded-none"
            type="range"
            min={0}
            max={100}
            value={videoProgress}
            defaultValue={0}
            onChange={handleChangeProgress}
          />

          <div
            ref={sectionBoxRef}
            style={{
              width: `${((section.endTime - section.startTime) / videoDuration) * 100}%`,
              height: "25%",
              position: "absolute",
              left: `${positionX}px`,
              cursor: "grab",
            }}
            onMouseDown={handleMouseDown}
            className="absolute top-0 bg-neutral-400 opacity-30 hover:opacity-60"
          ></div>
        </div>
      </div>
    </div>
  );
}
