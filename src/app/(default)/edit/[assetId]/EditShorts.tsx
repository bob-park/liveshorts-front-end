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
const MAX_PERCENT = 200;
const MIN_PERCENT = 100;
const DEFAULT_SECTION_SEC = 600;
const DEFAULT_INTERVAL_COUNT = 6;

export default function EditShorts({ videoSrc, templateList }: EditShortsProps) {
  // useRef
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const sectionBoxRef = useRef<HTMLDivElement>(null);
  const progressBarXRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const endXRef = useRef<number | null>(null);
  const prevProgressBarX = useRef<number>(0);
  const prevStartX = useRef<number>(0);
  const prevEndX = useRef<number>(0);
  const prevProgressWidth = useRef<number>(0);
  const prevProgressWidthPercent = useRef<number>(0);
  const templateImageRef = useRef<HTMLDivElement>(null);

  // useState
  // const [videoProgress, setVideoProgress] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [progressBarX, setProgressBarX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [isProgressBarDragging, setIsProgressBarDragging] = useState(false);
  const [isSectionBoxDragging, setIsSectionBoxDragging] = useState(false);
  const [isExpandDragging, setIsExpandDragging] = useState({
    startTime: false,
    endTime: false,
  });
  const [progressWidthPercent, setProgressWidthPercent] = useState(MIN_PERCENT);
  const [activePanel, setActivePanel] = useState<ActivePanel>("video");
  const [startTimeInput, setStartTimeInput] = useState<TimeObject>(secondsToTimeObject(0));
  const [endTimeInput, setEndTimeInput] = useState<TimeObject>(secondsToTimeObject(DEFAULT_SECTION_SEC));
  const [timeLineIntervalCount, setTimeLineIntervalCount] = useState(DEFAULT_INTERVAL_COUNT);
  const [selectedWorkMenu, setSelectedWorkMenu] = useState<WorkMenu>("template");
  const [titleContent, setTitleContent] = useState<TitleContent | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateSize, setTemplateSize] = useState({ width: 0, height: 0 });
  const [nonTemplateSectionSize, setNonTemplateSectionSize] = useState({ width: 0, height: 0 });

  const timeArray = fillRangeWithInterval(timeLineIntervalCount, videoDuration);
  const fontArray = ["SpoqaHanSansNeo-Thin", "SpoqaHanSansNeo-Regular", "SpoqaHanSansNeo-Bold"];

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
      if (isProgressBarDragging && progressBarXRef.current !== null && progressRef.current) {
        const progressWidth = progressRef.current.clientWidth;
        const progressBarWidth = progressBarRef.current!.clientWidth;
        const newDivX = e.clientX - progressBarXRef.current;
        const maxX = progressWidth - progressBarWidth;

        const newStartX = Math.max(0, Math.min(maxX, newDivX));

        setProgressBarX(newStartX);
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
      if (isSectionBoxDragging && startXRef.current !== null && progressRef.current) {
        const ProgressWidth = progressRef.current.clientWidth;
        const sectionBoxWidth = sectionBoxRef.current!.clientWidth;
        const newDivX = e.clientX - startXRef.current;
        const maxX = ProgressWidth - sectionBoxWidth;

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
      if (isExpandDragging.startTime && startXRef.current !== null && progressRef.current) {
        const ProgressWidth = progressRef.current.clientWidth;
        const sectionBoxWidth = sectionBoxRef.current!.clientWidth;
        const newDivX = e.clientX - startXRef.current;
        const maxX = ProgressWidth - sectionBoxWidth;

        const newX = Math.max(0, Math.min(maxX, newDivX));
        const newTime = pxToTime(newX);
        const newTimeObject = secondsToTimeObject(newTime);

        setStartTimeInput(newTimeObject);
        setStartX(newX);
        prevStartX.current = newX;
      }
      if (isExpandDragging.endTime && endXRef.current !== null && progressRef.current) {
        const ProgressWidth = progressRef.current.clientWidth;
        const newDivX = e.clientX - endXRef.current;
        const maxX = ProgressWidth;

        const newX = Math.max(0, Math.min(maxX, newDivX));
        const newTime = pxToTime(newX);
        const newTimeObject = secondsToTimeObject(newTime);

        setEndTimeInput(newTimeObject);

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
      if (progressRef.current && sectionBoxRef.current && progressBarRef.current) {
        const progressWidth = progressRef.current.clientWidth;
        const sectionBoxWidth = sectionBoxRef.current.clientWidth;
        const preogressBarWidth = progressBarRef.current.clientWidth;

        const resizeRatio = progressWidth / prevProgressWidth.current;
        const startMaxX = progressWidth - sectionBoxWidth;
        const endMaxX = progressWidth;
        const progressBarMaxX = progressWidth - preogressBarWidth;

        const newStartX = Math.min(startMaxX, prevStartX.current * resizeRatio);
        const newEndX = Math.min(endMaxX, prevEndX.current * resizeRatio);
        const newProgressBarX = Math.min(progressBarMaxX, prevProgressBarX.current * resizeRatio);

        setStartX(newStartX);
        setEndX(newEndX);
        setProgressBarX(newProgressBarX);

        prevStartX.current = newStartX;
        prevEndX.current = newEndX;
        prevProgressBarX.current = newProgressBarX;
      }
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    function handleChangeWitdhPercent() {
      if (progressRef.current && sectionBoxRef.current && progressBarRef.current && prevProgressWidthPercent.current) {
        const progressWidth = progressRef.current.clientWidth;
        const sectionBoxWidth = sectionBoxRef.current.clientWidth;
        const preogressBarWidth = progressBarRef.current.clientWidth;

        const resizeRatio = progressWidthPercent / prevProgressWidthPercent.current;
        const startMaxX = progressWidth - sectionBoxWidth;
        const endMaxX = progressWidth;
        const progressBarMaxX = progressWidth - preogressBarWidth;

        // TODO handleMouseDownProgress함수와 연관된 버그 해결

        const newStartX = Math.max(0, Math.min(startMaxX, prevStartX.current * resizeRatio));
        const newEndX = Math.max(0, Math.min(endMaxX, prevEndX.current * resizeRatio));
        const newProgressBarX = Math.max(0, Math.min(progressBarMaxX, prevProgressBarX.current * resizeRatio));

        setStartX(newStartX);
        setEndX(newEndX);
        setProgressBarX(newProgressBarX);

        prevStartX.current = newStartX;
        prevEndX.current = newEndX;
        prevProgressBarX.current = newProgressBarX;
      }
    }

    handleChangeWitdhPercent();

    return () => {
      handleChangeWitdhPercent();
    };
  }, [progressWidthPercent]);

  useEffect(() => {
    const handlePlayerKeyDown = (e: KeyboardEvent) => {
      if (videoRef.current && activePanel === "video") {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          videoRef.current.currentTime += 10;
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          videoRef.current.currentTime -= 10;
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
    if (videoRef.current) {
      const time = pxToTime(progressBarX);
      videoRef.current.currentTime = time;
      // setVideoProgress(time);
    }
  }, [progressBarX]);

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
    function handleWindowResize() {
      if (selectedTemplate?.videoPosition.y1 && templateImageRef.current) {
        setTemplateSize({
          width: ((videoRef.current?.clientHeight ?? 0) * 9) / 16,
          height: videoRef.current?.clientHeight ?? 0,
        });
      }
    }

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [selectedTemplate, videoRef, templateImageRef]);

  useEffect(() => {
    function handleWindowResize() {
      setNonTemplateSectionSize({
        width: videoRef.current?.clientWidth ?? 0,
        height: videoRef.current?.clientHeight ?? 0,
      });
    }

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [videoRef.current?.clientWidth, videoRef.current?.clientHeight]);

  // functions
  function handleMouseDownProgress(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const scrollLeft = progressRef.current.scrollLeft;
      const x = e.clientX - rect.left + scrollLeft;

      setProgressBarX(x);
      prevProgressBarX.current = x;
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
    // setVideoProgress(0);
  }

  function handleMouseDownProgressBar(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsProgressBarDragging(true);

    progressBarXRef.current = e.clientX - progressBarX;
  }

  function handleMouseDownSectionBox(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsSectionBoxDragging(true);

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
    return Math.round((time / videoDuration) * (progressRef.current?.clientWidth ?? 0));
  }

  function pxToTime(px: number) {
    return Math.round((px * videoDuration) / (progressRef.current?.clientWidth ?? 0));
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
          className="flex flex-col items-center p-2"
        >
          <div className="relative aspect-auto m-auto">
            {!loaded && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loading loading-spinner loading-lg text-black" />
            )}
            {selectedTemplate ? (
              <div
                ref={templateImageRef}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickPanel("template");
                  handleClickWorkMenu("template");
                }}
                style={{
                  width: templateSize.width,
                  height: templateSize.height,
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <img
                  src={`/api/v1/shorts/template/${selectedTemplate.templateId}/file?t=${new Date().getTime()}`}
                  alt="template-img"
                  className="w-full h-full"
                />
              </div>
            ) : (
              // TODO 추후에 작업할 것
              <div
                style={{
                  width: nonTemplateSectionSize.width,
                  height: nonTemplateSectionSize.height,
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex justify-between m-auto"
              >
                <div className="bg-slate-500 flex-1 bg-opacity-70"></div>
                <div style={{ width: ((videoRef.current?.clientHeight ?? 0) * 9) / 16 }} className=""></div>
                <div className="bg-slate-500 flex-1 bg-opacity-70"></div>
              </div>
            )}
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
            <video
              controls
              ref={videoRef}
              src={videoSrc}
              // onTimeUpdate={(e) => setVideoProgress((e.currentTarget.currentTime / videoDuration) * 100)}
              onLoadedMetadataCapture={handleLoadedMetadata}
              onPause={() => setIsPlay(false)}
              onPlay={() => setIsPlay(true)}
              onClick={(e) => {
                e.preventDefault();
              }}
              // TODO 이 부분을 위해서 relative div에 Ref 잡아야할듯
              // style={{width:}}
              className={`aspect-auto max-w-[calc(100vh-100px)] max-h-[calc(100vh-100px)] 
              ${loaded ? "block" : "hidden"}
              ${selectedTemplate && "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}
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
        style={{ width: `${progressWidthPercent}%` }}
        onMouseDown={handleMouseDownProgress}
        className="relative grid grid-rows-[32px,8px,200px] overflow-x-scroll"
      >
        <TimeLine timeLineIntervalCount={timeLineIntervalCount} timeArray={timeArray} videoDuration={videoDuration} />

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
          style={{
            left: `${progressBarX}px`,
          }}
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