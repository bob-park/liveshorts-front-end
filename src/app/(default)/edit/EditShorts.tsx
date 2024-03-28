"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "react-daisyui";
import { FaMagnifyingGlassPlus, FaMagnifyingGlassMinus } from "react-icons/fa6";
import { IoPause, IoPlay, IoPlayBack, IoPlayForward } from "react-icons/io5";
import IconButton from "./IconButton";

const TEST_ASSET_ID = "20";
const MAX_PERCENT = 200;
const MIN_PERCENT = 100;
const DEFAULT_SECTION_SEC = 600;

export default function EditShorts() {
  // useRef
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const sectionBoxRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const endXRef = useRef<number | null>(null);
  const prevStartX = useRef<number>(0);
  const prevEndX = useRef<number>(0);
  const prevProgressWidth = useRef<number>(0);

  // useState
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [endX, setEndX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpandDragging, setIsExpandDragging] = useState({ startTime: false, endTime: false });
  const [progressWidthPercent, setProgressWidthPercent] = useState(MIN_PERCENT);

  // useEffect
  useEffect(() => {
    videoRef.current?.load();
  }, []);

  useEffect(() => {
    prevEndX.current = timeToPx(DEFAULT_SECTION_SEC);
    setEndX(prevEndX.current);
  }, [videoDuration]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isDragging && startXRef.current !== null && progressRef.current) {
        const ProgressWidth = progressRef.current.clientWidth;
        const sectionBoxWidth = sectionBoxRef.current!.clientWidth;
        const newDivX = e.clientX - startXRef.current;
        const maxX = ProgressWidth - sectionBoxWidth;

        const newStartX = Math.max(0, Math.min(maxX, newDivX));
        const newEndX = newStartX + sectionBoxWidth;

        setStartX(newStartX);
        setEndX(newEndX);
        prevStartX.current = newStartX;
        prevEndX.current = newEndX;
      }
    }

    function handleMouseUp() {
      setIsDragging(false);
      startXRef.current = null;
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

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isExpandDragging.startTime && startXRef.current !== null && progressRef.current) {
        const ProgressWidth = progressRef.current.clientWidth;
        const sectionBoxWidth = sectionBoxRef.current!.clientWidth;
        const newDivX = e.clientX - startXRef.current;
        const maxX = ProgressWidth - sectionBoxWidth;

        const newX = Math.max(0, Math.min(maxX, newDivX));

        setStartX(newX);
        prevStartX.current = newX;
      }
      if (isExpandDragging.endTime && endXRef.current !== null && progressRef.current) {
        const ProgressWidth = progressRef.current.clientWidth;
        const newDivX = e.clientX - endXRef.current;
        const maxX = ProgressWidth;

        const newX = Math.max(0, Math.min(maxX, newDivX));

        setEndX(newX);
        prevEndX.current = newX;
      }
    }

    function handleMouseUp() {
      setIsExpandDragging({ startTime: false, endTime: false });
      startXRef.current = null;
      endXRef.current = null;
    }

    if (isExpandDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isExpandDragging]);

  prevProgressWidth.current = progressRef.current?.clientWidth ?? 0;

  useEffect(() => {
    function handleWindowResize() {
      if (progressRef.current && sectionBoxRef.current) {
        const progressWidth = progressRef.current.clientWidth;
        const sectionBoxWidth = sectionBoxRef.current.clientWidth;

        const resizeRatio = progressWidth / prevProgressWidth.current;
        const startMaxX = progressWidth - sectionBoxWidth;
        const endMaxX = progressWidth;

        const newStartX = Math.min(startMaxX, prevStartX.current * resizeRatio);
        const newEndX = Math.min(endMaxX, prevEndX.current * resizeRatio);

        setStartX(newStartX);
        setEndX(newEndX);

        prevStartX.current = newStartX;
        prevEndX.current = newEndX;
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

      const startMaxX = progressWidth - sectionBoxWidth;
      const endMaxX = progressWidth;

      const newStartX = Math.max(0, Math.min(startMaxX, (prevStartX.current * progressWidthPercent) / 100));
      const newEndX = Math.max(0, Math.min(endMaxX, (prevEndX.current * progressWidthPercent) / 100));

      setStartX(newStartX);
      setEndX(newEndX);
    }
  }, [progressWidthPercent]);

  useEffect(() => {
    const handlePlayerKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      if (videoRef.current) {
        if (e.key === "ArrowRight") {
          videoRef.current.currentTime += 10;
        } else if (e.key === "ArrowLeft") {
          videoRef.current.currentTime -= 10;
        } else if (e.key === " ") {
          const paused = videoRef.current.paused;

          paused ? videoRef.current.play() : videoRef.current.pause();
        }
      }
    };

    window.addEventListener("keydown", handlePlayerKeyDown);

    return () => {
      window.removeEventListener("keydown", handlePlayerKeyDown);
    };
  }, []);

  // functions
  function handleChangeProgress(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    const currentTime = videoDuration * (value / 100);

    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;

      setVideoProgress(value);
    }
  }

  function expandProgress() {
    setProgressWidthPercent((prev) => (prev === MAX_PERCENT ? prev : prev + 25));
  }

  function shrinkProgress() {
    setProgressWidthPercent((prev) => (prev === MIN_PERCENT ? prev : prev - 25));
  }

  function handleLoadedMetadata(e: React.SyntheticEvent<HTMLVideoElement>) {
    setVideoDuration(e.currentTarget.duration);
    setVideoProgress(0);
  }

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsDragging(true);

    startXRef.current = e.clientX - startX;
  }

  function handleMouseDownStartExpand(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsExpandDragging({ ...isExpandDragging, startTime: true });

    startXRef.current = e.clientX - startX;
  }

  function handleMouseDownEndExpand(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsExpandDragging({ ...isExpandDragging, endTime: true });

    endXRef.current = e.clientX - endX;
  }

  function handlePlay() {
    !isPlay ? videoRef.current?.play() : videoRef.current?.pause();
  }

  function handleBack() {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  }

  function handleFoward() {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  }

  function timeToPx(time: number) {
    return (time / videoDuration) * (progressRef.current?.clientWidth ?? 0);
  }

  // 추후에 startX, endX를 이용해서 api날릴 때 사용할 함수
  function pxToTime(px: number) {
    return (px * videoDuration) / (progressRef.current?.clientWidth ?? 0);
  }

  return (
    <div className="grid grid-rows-[1fr,50px,250px] h-full">
      <div className="grid grid-cols-[300px,1fr] border-b">
        <div className="border-r">작업 패널</div>

        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="h-[calc(100lvh-500px)] max-h-[calc(100lvh-500px)]">
            <video
              controls
              ref={videoRef}
              src={`/api/v1/asset/${TEST_ASSET_ID}/resource?fileType=HI_RES&t=${new Date().getTime}`}
              onTimeUpdate={(e) => setVideoProgress((e.currentTarget.currentTime / videoDuration) * 100)}
              onLoadedMetadataCapture={handleLoadedMetadata}
              onPause={() => setIsPlay(false)}
              onPlay={() => setIsPlay(true)}
              className="w-full h-full"
            ></video>
          </div>

          <div>
            <IconButton toolTip="10초 뒤로" onClick={handleBack} Icon={<IoPlayBack />}></IconButton>
            <IconButton
              toolTip={isPlay ? "정지" : "재생"}
              onClick={handlePlay}
              Icon={isPlay ? <IoPause /> : <IoPlay />}
            ></IconButton>
            <IconButton toolTip="10초 앞으로" onClick={handleFoward} Icon={<IoPlayForward />}></IconButton>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <span>{progressWidthPercent}%</span>
        <IconButton toolTip="25% 확대" onClick={expandProgress} Icon={<FaMagnifyingGlassPlus />}></IconButton>
        <IconButton toolTip="25% 축소" onClick={shrinkProgress} Icon={<FaMagnifyingGlassMinus />}></IconButton>
      </div>

      <div className="grid grid-rows-[50px,200px] overflow-x-scroll">
        <div>줄자</div>
        <div ref={progressRef} style={{ width: `${progressWidthPercent}%` }} className="relative h-full">
          {/* section */}
          <div className="w-full h-1/4 absolute top-0">
            <div
              ref={sectionBoxRef}
              style={{
                width: `${endX - startX}px`,
                left: `${startX}px`,
              }}
              onMouseDown={handleMouseDown}
              className={`
			          absolute top-0 flex justify-between z-50 h-full
			          cursor-grab rounded-lg
                group
			          opacity-30 hover:opacity-60
                bg-neutral-400
			          `}
            >
              <div
                onMouseDown={handleMouseDownStartExpand}
                style={{ width: `${(progressRef.current?.clientWidth ?? 0) / 100}px` }}
                className={`
			            cursor-w-resize
			            opacity-0 group-hover:opacity-100
			          bg-neutral-600`}
              ></div>
              <div
                onMouseDown={handleMouseDownEndExpand}
                style={{ width: `${(progressRef.current?.clientWidth ?? 0) / 100}px` }}
                className={`
			            cursor-e-resize
			            opacity-0 group-hover:opacity-100
			          bg-neutral-600`}
              ></div>
            </div>
          </div>

          {/* bgm */}
          <div className="w-full h-1/4 absolute top-1/4 border-t border-neutral-500">bgm</div>

          {/* title */}
          <div className="w-full h-1/4 absolute top-2/4 border-t border-neutral-500">title</div>

          {/* subtitle */}
          <div className="w-full h-1/4 absolute top-3/4 border-t border-neutral-500">subtitle</div>

          <input
            type="range"
            min={0}
            max={100}
            value={videoProgress}
            onChange={handleChangeProgress}
            className="w-full progress h-full rounded-none"
          />
        </div>
      </div>
    </div>
  );
}
