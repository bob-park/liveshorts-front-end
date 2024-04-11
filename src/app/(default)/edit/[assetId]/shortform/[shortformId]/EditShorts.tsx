"use client";

import { useEffect, useRef, useState } from "react";
import { TimeObject } from "@/components/edit/TimeInput";
import ControlBar from "./ControlBar";
import SectionBox from "./SectionBox";
import { secondsToTimeObject, timeObjectToSeconds, fillRangeWithInterval } from "./util";
import TimeLine from "./TimeLine";
import TabMenu from "./TabMenu";
import TitleMenu from "./menu/TitleMenu";
import SubtitleMenu from "./menu/SubtitleMenu";
import BgmMenu from "./menu/BgmMenu";
import TitleInput from "./menu/TitleInput";
import TemplateMenu from "./menu/TemplateMenu";
import { TitleContent, ActivePanel, WorkMenu, Template } from "./type";

interface EditShortsProps {
  videoSrc: string;
  templateList: Template[];
}

export const WIDTH_PERCENT_STEP = 25;
export const MINIMUM_UNIT_WIDTH = 60;
const MAX_PERCENT = 400;
const MIN_PERCENT = 100;
const DEFAULT_SECTION_SEC = 600;
const DEFAULT_INTERVAL_COUNT = 6;
const SIXTY_SECONDS = 60;
const FORWARD_BACKWARD_STEP_SECONDS = 10;

export default function EditShorts({ videoSrc, templateList }: EditShortsProps) {
  // useRef
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const sectionBoxRef = useRef<HTMLDivElement>(null);
  const progressBarXRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const endXRef = useRef<number | null>(null);
  const videoXRef = useRef<number | null>(null);
  const prevProgressBarX = useRef<number>(0);
  const prevStartX = useRef<number>(0);
  const prevEndX = useRef<number>(0);
  const prevVideoX = useRef<number>(0);
  const prevProgressWidth = useRef<number>(0);
  const prevProgressWidthPercent = useRef<number>(0);
  const templateImageRef = useRef<HTMLDivElement>(null);
  const videoAreaRef = useRef<HTMLDivElement>(null);
  const prevVideoAreaWidth = useRef<number>(0);
  const prevVideoAreaHeight = useRef<number>(0);

  // useState
  const [loaded, setLoaded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [videoX, setVideoX] = useState(0);
  const [isProgressBarDragging, setIsProgressBarDragging] = useState(false);
  const [isSectionBoxDragging, setIsSectionBoxDragging] = useState(false);
  const [isExpandDragging, setIsExpandDragging] = useState({
    startTime: false,
    endTime: false,
  });
  const [isVideoDragging, setIsVideoDragging] = useState(false);
  const [progressWidthPercent, setProgressWidthPercent] = useState(MIN_PERCENT);
  const [activePanel, setActivePanel] = useState<ActivePanel>("video");
  const [startTimeInput, setStartTimeInput] = useState<TimeObject>(secondsToTimeObject(0));
  const [endTimeInput, setEndTimeInput] = useState<TimeObject>(secondsToTimeObject(DEFAULT_SECTION_SEC));
  const [timeLineIntervalCount, setTimeLineIntervalCount] = useState(DEFAULT_INTERVAL_COUNT);
  const [selectedWorkMenu, setSelectedWorkMenu] = useState<WorkMenu>("template");
  const [titleContent, setTitleContent] = useState<TitleContent | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateImageSize, setTemplateImageSize] = useState({ width: 0, height: 0 });

  const timeArray = fillRangeWithInterval(timeLineIntervalCount, videoDuration);
  const fontArray = ["SpoqaHanSansNeo-Thin", "SpoqaHanSansNeo-Regular", "SpoqaHanSansNeo-Bold"];
  const unitWidth = (progressWidthPercent / 100) * MINIMUM_UNIT_WIDTH;

  // useEffect
  useEffect(() => {
    videoRef.current?.load();
  }, []);

  useEffect(() => {
    prevEndX.current = timeToPx(DEFAULT_SECTION_SEC);
    setEndX(prevEndX.current);
    prevProgressWidth.current = progressRef.current?.scrollWidth ?? 0;
  }, [videoDuration]);

  useEffect(() => {
    if (videoAreaRef.current) {
      prevVideoAreaWidth.current = videoAreaRef.current.clientWidth;
      prevVideoAreaHeight.current = videoAreaRef.current.clientHeight;
    }
  }, []);

  useEffect(() => {
    if (videoAreaRef.current) {
      setTemplateImageSize({
        width: (videoAreaRef.current.clientHeight * 9) / 16,
        height: videoAreaRef.current.clientHeight,
      });
    }
  }, [templateImageRef.current, selectedTemplate]);

  useEffect(() => {
    if (loaded && videoAreaRef.current) {
      const videoHeight =
        templateImageSize.height *
        ((selectedTemplate?.videoPosition.y2 ?? 1) - (selectedTemplate?.videoPosition.y1 ?? 0));
      const videoWidth = (videoHeight * 16) / 9;
      const initialX = (videoAreaRef.current.clientWidth - videoWidth) / 2;

      setVideoX(initialX);
      prevVideoX.current = initialX;
    }
  }, [loaded]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (
        isProgressBarDragging &&
        progressBarXRef.current !== null &&
        progressRef.current &&
        progressBarRef.current &&
        videoRef.current
      ) {
        const scrollLeft = progressRef.current.scrollLeft;

        const newDivX = e.clientX + scrollLeft - progressBarXRef.current;
        const maxX = (videoDuration * progressWidthPercent) / 100;

        const newStartX = Math.max(0, Math.min(maxX, newDivX));
        const time = pxToTime(newStartX);

        videoRef.current.currentTime = time;
        setVideoProgress(time);
        progressBarRef.current.style.left = `${newStartX}px`;
        prevProgressBarX.current = newStartX;
      }
    }

    function handleMouseUp() {
      setIsProgressBarDragging(false);
      progressBarXRef.current = null;
    }

    if (isProgressBarDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isProgressBarDragging]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isSectionBoxDragging && startXRef.current !== null && progressRef.current && sectionBoxRef.current) {
        const scrollLeft = progressRef.current.scrollLeft;
        const sectionBoxWidth = sectionBoxRef.current.clientWidth;

        const newDivX = e.clientX + scrollLeft - startXRef.current;
        const maxX = (videoDuration * progressWidthPercent) / 100 - sectionBoxWidth;
        const newStartX = Math.max(0, Math.min(maxX, newDivX));
        const newEndX = newStartX + sectionBoxWidth;

        const newStartTime = pxToTime(newStartX);
        const newEndTime = pxToTime(newEndX);
        const newStartTimeObject = secondsToTimeObject(newStartTime);
        const newEndTimeObject = secondsToTimeObject(newEndTime);

        setStartTimeInput(newStartTimeObject);
        setEndTimeInput(newEndTimeObject);
        setStartX(newStartX);
        setEndX(newEndX);
        prevStartX.current = newStartX;
        prevEndX.current = newEndX;
      }
    }

    function handleMouseUp() {
      setIsSectionBoxDragging(false);
      startXRef.current = null;
    }

    if (isSectionBoxDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSectionBoxDragging]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (progressRef.current && sectionBoxRef.current) {
        const scrollLeft = progressRef.current.scrollLeft;
        const progressWidth = progressRef.current.scrollWidth;
        if (isExpandDragging.startTime && startXRef.current !== null) {
          const sectionBoxWidth = sectionBoxRef.current.clientWidth;
          const newDivX = e.clientX + scrollLeft - startXRef.current;
          const maxX = progressWidth - sectionBoxWidth;

          const newX = Math.max(0, Math.min(maxX, newDivX));
          const newTime = pxToTime(newX);
          const newTimeObject = secondsToTimeObject(newTime);

          setStartTimeInput(newTimeObject);
          setStartX(newX);
          prevStartX.current = newX;
        }
        if (isExpandDragging.endTime && endXRef.current !== null && progressRef.current) {
          const newDivX = e.clientX + scrollLeft - endXRef.current;
          const maxX = progressWidth;

          const newX = Math.max(0, Math.min(maxX, newDivX));
          const newTime = pxToTime(newX);
          const newTimeObject = secondsToTimeObject(newTime);

          setEndTimeInput(newTimeObject);
          setEndX(newX);
          prevEndX.current = newX;
        }
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

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (
        isVideoDragging &&
        videoXRef.current !== null &&
        videoRef.current &&
        templateImageRef.current &&
        videoAreaRef.current
      ) {
        const initialX = (videoAreaRef.current.clientWidth - videoRef.current.clientWidth) / 2;
        const newDivX = e.clientX - videoXRef.current;
        const maxX = (videoAreaRef.current.clientWidth - templateImageSize.width) / 2;
        const minX = initialX - (videoRef.current.clientWidth - templateImageSize.width) / 2;

        const newX = Math.max(minX, Math.min(newDivX, maxX));

        setVideoX(newX);
        prevVideoX.current = newX;
      }
    }

    function handleMouseUp() {
      setIsVideoDragging(false);
      videoXRef.current = null;
    }

    if (isVideoDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isVideoDragging]);

  useEffect(() => {
    function handleChangeWitdhPercent() {
      if (
        progressRef.current &&
        sectionBoxRef.current &&
        progressBarRef.current &&
        prevProgressWidthPercent.current &&
        videoRef.current
      ) {
        const progressWidth = progressRef.current.scrollWidth;
        const sectionBoxWidth = sectionBoxRef.current.clientWidth;
        const preogressBarWidth = progressBarRef.current.clientWidth;

        const resizeRatio = progressWidthPercent / prevProgressWidthPercent.current;
        const startMaxX = progressWidth - sectionBoxWidth;
        const endMaxX = progressWidth;
        const progressBarMaxX = progressWidth - preogressBarWidth;

        // TODO section box와 연관된 버그 해결

        const newStartX = Math.max(0, Math.min(startMaxX, prevStartX.current * resizeRatio));
        const newEndX = Math.max(0, Math.min(endMaxX, prevEndX.current * resizeRatio));
        const newProgressBarX = Math.max(0, Math.min(progressBarMaxX, prevProgressBarX.current * resizeRatio));

        const time = pxToTime(newProgressBarX);

        setStartX(newStartX);
        setEndX(newEndX);

        prevStartX.current = newStartX;
        prevEndX.current = newEndX;

        videoRef.current.currentTime = time;
        setVideoProgress(time);
        progressBarRef.current.style.left = `${newProgressBarX}px`;
        prevProgressBarX.current = newProgressBarX;
      }
    }

    handleChangeWitdhPercent();

    return () => {
      handleChangeWitdhPercent();
    };
  }, [progressWidthPercent]);

  useEffect(() => {
    function handleWindowResize() {
      if (videoAreaRef.current && videoRef.current && templateImageRef.current) {
        const newVideoAreaWidth = videoAreaRef.current.clientWidth;
        const newVideoAreaHeight = videoAreaRef.current.clientHeight;

        const widthChangeRatio = newVideoAreaWidth / prevVideoAreaWidth.current;
        const heightChangeRatio = newVideoAreaHeight / prevVideoAreaHeight.current;

        setTemplateImageSize((prev) => {
          const newHeight = prev.height * heightChangeRatio;
          const newWidth = (newHeight * 9) / 16;
          return { width: newWidth, height: newHeight };
        });

        setVideoX((prev) => {
          // TODO 거리 계산 다시 할 것
          const newX = prev * widthChangeRatio;

          prevVideoX.current = newX;
          return newX;
        });

        prevVideoAreaWidth.current = newVideoAreaWidth;
        prevVideoAreaHeight.current = newVideoAreaHeight;
      }
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const handlePlayerKeyDown = (e: KeyboardEvent) => {
      if (videoRef.current && activePanel === "video") {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          videoRef.current.currentTime += FORWARD_BACKWARD_STEP_SECONDS;
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          videoRef.current.currentTime -= FORWARD_BACKWARD_STEP_SECONDS;
        } else if (e.key === " ") {
          e.preventDefault();
          const paused = videoRef.current.paused;

          paused ? videoRef.current.play() : videoRef.current.pause();
        }
      }
    };

    window.addEventListener("keydown", handlePlayerKeyDown);

    return () => {
      window.removeEventListener("keydown", handlePlayerKeyDown);
    };
  }, [activePanel]);

  useEffect(() => {
    const newStartTime = timeObjectToSeconds(startTimeInput);
    const newEndTime = timeObjectToSeconds(endTimeInput);

    const newStartX = timeToPx(newStartTime);
    const newEndX = timeToPx(newEndTime);

    setStartX(newStartX);
    setEndX(newEndX);

    prevStartX.current = newStartX;
    prevEndX.current = newEndX;
  }, [startTimeInput, endTimeInput, videoDuration]);

  useEffect(() => {
    function handleTimeUpdate() {
      const newX = (videoProgress * progressWidthPercent) / 100;
      if (progressBarRef.current) {
        progressBarRef.current.style.left = `${newX}px`;
        prevProgressBarX.current = newX;
      }
    }

    handleTimeUpdate();

    return () => {
      handleTimeUpdate();
    };
  }, [videoProgress]);

  // functions
  function handleMouseDownProgress(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (progressRef.current && progressBarRef.current && videoRef.current) {
      const maxX = (videoDuration * progressWidthPercent) / 100;

      const rect = progressRef.current.getBoundingClientRect();
      const scrollLeft = progressRef.current.scrollLeft;
      const x = e.clientX - rect.left + scrollLeft;
      const time = pxToTime(x);

      if (x > maxX) return;

      videoRef.current.currentTime = time;
      setVideoProgress(time);
      progressBarRef.current.style.left = `${x}px`;
      prevProgressBarX.current = x;
    }
  }

  function handleMouseDownProgressBar(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsProgressBarDragging(true);

    if (progressRef.current) {
      const scrollLeft = progressRef.current.scrollLeft;

      progressBarXRef.current = e.clientX - timeToPx(videoProgress) + scrollLeft;
    }
  }

  function expandProgress() {
    setProgressWidthPercent((prev) => (prev === MAX_PERCENT ? prev : prev + WIDTH_PERCENT_STEP));
    prevProgressWidthPercent.current = progressWidthPercent;

    setTimeLineIntervalCount((prev) => (progressWidthPercent === MAX_PERCENT ? prev : prev + 1));
  }

  function shrinkProgress() {
    setProgressWidthPercent((prev) => (prev === MIN_PERCENT ? prev : prev - WIDTH_PERCENT_STEP));
    prevProgressWidthPercent.current = progressWidthPercent;

    setTimeLineIntervalCount((prev) => (progressWidthPercent === MIN_PERCENT ? prev : prev - 1));
  }

  function handleLoadedMetadata(e: React.SyntheticEvent<HTMLVideoElement>) {
    setVideoDuration(e.currentTarget.duration);
    setLoaded(true);
  }

  function handleMouseDownSectionBox(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsSectionBoxDragging(true);
    if (progressRef.current) {
      const scrollLeft = progressRef.current.scrollLeft;

      startXRef.current = e.clientX - startX + scrollLeft;
    }
  }

  function handleMouseDownStartExpand(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsExpandDragging({ ...isExpandDragging, startTime: true });

    if (progressRef.current) {
      const scrollLeft = progressRef.current.scrollLeft;

      startXRef.current = e.clientX - startX + scrollLeft;
    }
  }

  function handleMouseDownEndExpand(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsExpandDragging({ ...isExpandDragging, endTime: true });

    if (progressRef.current) {
      const scrollLeft = progressRef.current.scrollLeft;

      endXRef.current = e.clientX - endX + scrollLeft;
    }
  }

  function handleMouseDownVideo(e: React.MouseEvent<HTMLVideoElement>) {
    e.stopPropagation();
    setIsVideoDragging(true);

    videoXRef.current = e.clientX - videoX;
  }

  function handlePlay() {
    !isPlay ? videoRef.current?.play() : videoRef.current?.pause();
  }

  function handleBack() {
    if (videoRef.current) {
      videoRef.current.currentTime -= FORWARD_BACKWARD_STEP_SECONDS;
    }
  }

  function handleFoward() {
    if (videoRef.current) {
      videoRef.current.currentTime += FORWARD_BACKWARD_STEP_SECONDS;
    }
  }

  function timeToPx(time: number) {
    return (time * unitWidth) / SIXTY_SECONDS;
  }

  function pxToTime(px: number) {
    return (px / unitWidth) * SIXTY_SECONDS;
  }

  function handleChangeStartTimeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setStartTimeInput({ ...startTimeInput, [name]: value });
  }

  function handleChangeEndTimeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEndTimeInput({ ...startTimeInput, [name]: value });
  }

  function handleClickPanel(panel: ActivePanel) {
    setActivePanel(panel);
  }

  function handleClickWorkMenu(workMenu: WorkMenu) {
    setSelectedWorkMenu(workMenu);
  }

  function handleClickAddTitle() {
    const newTitle = {
      text: "제목을 입력하세요.",
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 0.2,
      font: fontArray[1],
      size: 30,
      color: "#ffffff",
      background: "#000000",
      textOpacity: 1,
      bgOpacity: 1,
    };
    setTitleContent(newTitle);
  }

  function handleClickDeleteTitle() {
    setTitleContent(null);
  }

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (titleContent) {
      setTitleContent({ ...titleContent, [name]: value });
    }
  }

  function handleClickTemplate(template?: Template) {
    setSelectedTemplate(template ?? null);
  }

  return (
    <div className="grid grid-rows-[1fr,240px] h-full">
      <div className="grid grid-cols-[340px,1fr] border-b">
        <div
          onClick={() => {
            handleClickPanel("title");
          }}
          className="border-r flex flex-col"
        >
          <TabMenu selectedWorkMenu={selectedWorkMenu} handleClickWorkMenu={handleClickWorkMenu} />
          {selectedWorkMenu === "template" && (
            <TemplateMenu
              templateList={templateList}
              selectedTemplateId={selectedTemplate?.templateId ?? ""}
              handleClickTemplate={handleClickTemplate}
            />
          )}
          {selectedWorkMenu === "title" && (
            <TitleMenu
              titleContent={titleContent}
              optionArray={fontArray}
              handleClickAddTitle={handleClickAddTitle}
              handleClickDeleteTitle={handleClickDeleteTitle}
              handleChangeTitle={handleChangeTitle}
              handleClickWorkMenu={handleClickWorkMenu}
            />
          )}
          {selectedWorkMenu === "subtitle" && <SubtitleMenu />}
          {selectedWorkMenu === "bgm" && <BgmMenu />}
        </div>

        <div
          onClick={() => {
            handleClickPanel("video");
          }}
          className="grid grid-rows-[1fr,70px] max-w-[calc(100vw-340px)]"
        >
          <div
            ref={videoAreaRef}
            style={{ minWidth: videoRef.current?.clientWidth }}
            className={`relative w-full h-[calc(100vh-500px)] min-h-[100px] flex justify-center items-center m-auto overflow-hidden`}
          >
            {!loaded && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loading loading-spinner loading-lg text-black" />
            )}

            <div
              ref={templateImageRef}
              onClick={(e) => {
                e.stopPropagation();
                handleClickPanel("template");
                handleClickWorkMenu("template");
              }}
              style={{ width: templateImageSize.width, height: templateImageSize.height }}
              className={`relative border border-green-500 ${loaded ? "block" : "hidden"}`}
            >
              <div
                style={{
                  height:
                    templateImageSize.height *
                    ((selectedTemplate?.videoPosition.y2 ?? 1) - (selectedTemplate?.videoPosition.y1 ?? 0)),
                  top: (videoAreaRef.current?.clientHeight ?? 0) * (selectedTemplate?.videoPosition.y1 ?? 0),
                }}
                className="absolute w-full border border-red-500 z-10"
              ></div>
              <img
                src={`/api/v1/shorts/template/${selectedTemplate?.templateId}/file`}
                alt="template-img"
                className="w-full h-full"
              />
              {titleContent && (
                <TitleInput
                  title={titleContent}
                  handleChangeTitle={handleChangeTitle}
                  handleClickPanel={() => {
                    handleClickPanel("title");
                  }}
                  handleClickWorkMenu={handleClickWorkMenu}
                />
              )}
            </div>

            <video
              controls
              playsInline
              ref={videoRef}
              src={videoSrc}
              onTimeUpdate={(e) => {
                setVideoProgress(e.currentTarget.currentTime);
              }}
              onLoadedMetadataCapture={handleLoadedMetadata}
              onPause={() => setIsPlay(false)}
              onPlay={() => setIsPlay(true)}
              onClick={(e) => {
                e.preventDefault();
              }}
              onMouseDown={handleMouseDownVideo}
              style={{
                height: `${
                  templateImageSize.height *
                  ((selectedTemplate?.videoPosition.y2 ?? 1) - (selectedTemplate?.videoPosition.y1 ?? 0))
                }px`,
                left: `${videoX}px`,
              }}
              className={`aspect-auto absolute
              /-translate-x-1/2
              ${loaded ? "block" : "hidden"}
              `}
            ></video>
          </div>

          <ControlBar
            startTimeInput={startTimeInput}
            endTimeInput={endTimeInput}
            isPlay={isPlay}
            progressWidthPercent={progressWidthPercent}
            handleChangeStartTimeInput={handleChangeStartTimeInput}
            handleChangeEndTimeInput={handleChangeEndTimeInput}
            handleBack={handleBack}
            handleFoward={handleFoward}
            handlePlay={handlePlay}
            expandProgress={expandProgress}
            shrinkProgress={shrinkProgress}
          />
        </div>
      </div>

      <div
        ref={progressRef}
        // style={{ width: `calc(${progressWidthPercent / 100} * 100vw)` }}
        onMouseDown={handleMouseDownProgress}
        className="relative grid grid-rows-[32px,8px,200px] max-w-[3000px] overflow-x-scroll"
      >
        <TimeLine
          timeLineIntervalCount={timeLineIntervalCount}
          timeArray={timeArray}
          videoDuration={videoDuration}
          progressWidthPercent={progressWidthPercent}
          unitWidth={unitWidth}
        />

        <div className="w-full h-2 bg-slate-200"></div>

        <div className="h-full bg-slate-50">
          {/* section */}
          <div className="relative h-1/4 border-b border-slate-300">
            <SectionBox
              sectionBoxRef={sectionBoxRef}
              startX={startX}
              endX={endX}
              activePanel={activePanel}
              handleMouseDownSectionBox={handleMouseDownSectionBox}
              handleMouseDownStartExpand={handleMouseDownStartExpand}
              handleMouseDownEndExpand={handleMouseDownEndExpand}
              handleClickPanel={() => {
                handleClickPanel("video");
              }}
            />
          </div>

          {/* title */}
          <div className="relative h-1/4 border-b border-slate-300"></div>

          {/* subtitle */}
          <div className="relative h-1/4 border-b border-slate-300"></div>

          {/* bgm */}
          <div className="relative h-1/4 border-b border-slate-300"></div>
        </div>

        <div
          ref={progressBarRef}
          onMouseDown={handleMouseDownProgressBar}
          className={`
					w-1 absolute top-0 bottom-0
					cursor-pointer
					bg-red-700 progressBar`}
        ></div>
      </div>
    </div>
  );
}
