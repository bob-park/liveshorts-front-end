"use client";

import { useEffect, useRef, useState } from "react";
import VideoControlBar from "./VideoControlBar";
import SectionBox from "./SectionBox";
import {
  getCorrectEndTime,
  getCorrectStartTime,
  secondsToHhmmss,
  secondsToTimeObject,
  timeObjectToSeconds,
} from "./util";
import TimeLine from "./TimeLine";
import TabMenu from "./TabMenu";
import TitleMenu from "./menu/TitleMenu";
import SubtitleMenu from "./menu/SubtitleMenu";
import BgmMenu from "./menu/BgmMenu";
import TemplateMenu from "./menu/TemplateMenu";
import { TitleContent, ActivePanel, WorkMenu, Template, Bgm, SubtitleContent, TimeObject } from "./type";
import SectionControlBar from "./SectionControlBar";
import VideoArea from "./VideoArea";
import useRequest from "@/hooks/stream/useRequest";

interface EditShortsProps {
  shortformId: string;
  videoSrc: string;
  templateList: Template[];
  bgmList: Bgm[];
}

export const WIDTH_PERCENT_STEP = 25;
export const MINIMUM_UNIT_WIDTH = 60;
export const FORWARD_BACKWARD_STEP_SECONDS = 10;
export const FONT_ARRAY = ["SpoqaHanSansNeo-Thin", "SpoqaHanSansNeo-Regular", "SpoqaHanSansNeo-Bold"];
export const SHORTS_WIDTH = 1080;
const SHORTS_HEIGHT = 1920;
const MAX_PERCENT = 400;
const MIN_PERCENT = 100;
const DEFAULT_SECTION_SEC = 600;
const SIXTY_SECONDS = 60;
const DEFAULT_SUBTITLE_SEC = 10;
const DEFAULT_TITLE_CONTENT = {
  text: "제목을 입력하세요.",
  x1: 0,
  y1: 0,
  x2: 1,
  y2: 0.2,
  font: FONT_ARRAY[1],
  size: 60,
  color: "#ffffff",
  background: "#000000",
  textOpacity: 1,
  bgOpacity: 0,
};
const SECTION_BOX_MINIMUM_WIDTH = 24;

export default function EditShorts({ shortformId, videoSrc, templateList, bgmList }: EditShortsProps) {
  // useRef
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const sectionBoxRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const progressBarXRef = useRef<number | null>(null);
  const initialXRef = useRef<number | null>(null);
  const videoXRef = useRef<number | null>(null);
  const prevProgressBarX = useRef<number>(0);
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
  const [videoVolume, setVideoVolume] = useState(100);
  const [isPlay, setIsPlay] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [sectionInfo, setSectionInfo] = useState<{
    startX: number;
    endX: number;
    startTime: TimeObject;
    endTime: TimeObject;
  }>({
    startX: 0,
    endX: 0,
    startTime: secondsToTimeObject(0),
    endTime: secondsToTimeObject(DEFAULT_SECTION_SEC),
  });
  const [videoX, setVideoX] = useState(0);
  const [isProgressBarDragging, setIsProgressBarDragging] = useState(false);
  const [isSectionBoxDragging, setIsSectionBoxDragging] = useState(false);
  const [isExpandDragging, setIsExpandDragging] = useState({
    startTime: false,
    endTime: false,
  });
  const [isSubtitleExpandDragging, setIsSubtitleExpandDragging] = useState({ startTime: false, endTime: false });
  const [isSubtitleDragging, setIsSubtitleDragging] = useState(false);
  const [isVideoDragging, setIsVideoDragging] = useState(false);
  const [progressWidthPercent, setProgressWidthPercent] = useState(MIN_PERCENT);
  const [activePanel, setActivePanel] = useState<ActivePanel>("video");
  const [selectedWorkMenu, setSelectedWorkMenu] = useState<WorkMenu>("template");
  const [titleContent, setTitleContent] = useState<TitleContent>(DEFAULT_TITLE_CONTENT);
  const [subtitleContentArray, setSubtitleContentArray] = useState<SubtitleContent[]>([]);
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState<number | null>(null);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState<number | null>(null);
  const [hasTitle, setHasTitle] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedBgm, setSelectedBgm] = useState<Bgm | null>(null);
  const [templateImageSize, setTemplateImageSize] = useState({ width: 0, height: 0 });

  const unitWidth = (progressWidthPercent / 100) * MINIMUM_UNIT_WIDTH;

  // request stream
  const { onRequest, isLoading } = useRequest(shortformId);

  const imgElement = templateImageRef.current?.querySelector("img");
  const imgHeight = imgElement?.naturalHeight ?? 0;
  const videoWidth = videoRef.current?.videoWidth ?? 0;
  const videoHeight = videoRef.current?.videoHeight ?? 0;
  const videoClientWidth = videoRef.current?.clientWidth ?? 0;

  const heightRatio = selectedTemplate
    ? (imgHeight * (selectedTemplate.videoPosition.y2 - selectedTemplate.videoPosition.y1)) / videoHeight
    : SHORTS_HEIGHT / videoHeight;
  const widthRatio = videoClientWidth / videoWidth;

  useEffect(() => {
    if (videoAreaRef.current && videoRef.current && templateImageRef.current) {
      const videoAreaWidth = videoAreaRef.current.clientWidth;
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      const templateImageWidth = templateImageRef.current.clientWidth;

      const x = (videoAreaWidth / 2 - templateImageWidth / 2 - videoX) / widthRatio;
      const y = selectedTemplate ? selectedTemplate.videoPosition.y1 * imgHeight : 0;

      const width = videoWidth / heightRatio;
      const height = videoHeight;

      const timer = setTimeout(() => {
        onRequest({
          type: "VIDEO",
          startTime: secondsToHhmmss(pxToSeconds(sectionInfo.startX)),
          endTime: secondsToHhmmss(pxToSeconds(sectionInfo.endX)),
          options: { x, y, width, height },
        });
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [sectionInfo, videoX, selectedTemplate, heightRatio, widthRatio, imgHeight]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onRequest({
        type: "TITLE",
        content: titleContent.text,
        startTime: secondsToHhmmss(pxToSeconds(sectionInfo.startX)),
        endTime: secondsToHhmmss(pxToSeconds(sectionInfo.endX)),
      });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [titleContent]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onRequest({
        type: "BGM",
        ref: selectedBgm?.bgmId,
        startTime: secondsToHhmmss(pxToSeconds(sectionInfo.startX)),
        endTime: secondsToHhmmss(pxToSeconds(sectionInfo.endX)),
      });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [selectedBgm]);

  // useEffect
  useEffect(() => {
    videoRef.current?.load();
  }, []);

  useEffect(() => {
    const px = secondsToPx(DEFAULT_SECTION_SEC);
    prevProgressWidth.current = progressRef.current?.scrollWidth ?? 0;
    setSectionInfo({ ...sectionInfo, endX: px });
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
        const time = pxToSeconds(newStartX);

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
      if (isSectionBoxDragging && initialXRef.current !== null && progressRef.current && sectionBoxRef.current) {
        const scrollLeft = progressRef.current.scrollLeft;
        const sectionBoxWidth = sectionBoxRef.current.clientWidth;

        const newDivX = e.clientX + scrollLeft - initialXRef.current;
        const maxX = (videoDuration * progressWidthPercent) / 100 - sectionBoxWidth;

        const startX = Math.max(0, Math.min(maxX, newDivX));
        const endX = startX + sectionBoxWidth;
        const startTime = pxToTimeObject(startX);
        const endTime = pxToTimeObject(endX);

        setSectionInfo({ startX, endX, startTime, endTime });
      }
    }

    function handleMouseUp() {
      setIsSectionBoxDragging(false);
      initialXRef.current = null;
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
      if (
        isSubtitleDragging &&
        initialXRef.current !== null &&
        progressRef.current &&
        selectedSubtitleIndex !== null &&
        selectedSubtitleIndex >= 0
      ) {
        const scrollLeft = progressRef.current.scrollLeft;
        const selectedSubtitle = subtitleContentArray[selectedSubtitleIndex];
        const subtitleStartTime = timeObjectToSeconds(selectedSubtitle.startTime);
        const subtitleEndTime = timeObjectToSeconds(selectedSubtitle.endTime);
        const sectionBoxWidth = secondsToPx(subtitleEndTime - subtitleStartTime);

        const newDivX = e.clientX + scrollLeft - initialXRef.current;
        const maxX = (videoDuration * progressWidthPercent) / 100 - sectionBoxWidth;

        const startX = Math.max(0, Math.min(maxX, newDivX));
        const endX = startX + sectionBoxWidth;
        const startTime = pxToTimeObject(startX);
        const endTime = pxToTimeObject(endX);

        setSubtitleContentArray((prev) => {
          const updatedArray = [...prev];
          updatedArray[selectedSubtitleIndex] = {
            ...updatedArray[selectedSubtitleIndex],
            startX,
            endX,
            startTime,
            endTime,
          };

          return updatedArray;
        });
      }
    }

    function handleMouseUp() {
      setIsSubtitleDragging(false);
      initialXRef.current = null;
    }

    if (isSubtitleDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSubtitleDragging]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (progressRef.current) {
        const scrollLeft = progressRef.current.scrollLeft;
        const progressWidth = progressRef.current.scrollWidth;
        if (isExpandDragging.startTime && initialXRef.current !== null) {
          const newDivX = e.clientX + scrollLeft - initialXRef.current;
          const maxX = sectionInfo.endX - SECTION_BOX_MINIMUM_WIDTH;

          const startX = Math.max(0, Math.min(maxX, newDivX));
          const startTime = pxToTimeObject(startX);

          setSectionInfo({ ...sectionInfo, startTime, startX });
        }
        if (isExpandDragging.endTime && initialXRef.current !== null && progressRef.current) {
          const newDivX = e.clientX + scrollLeft - initialXRef.current;
          const maxX = progressWidth;
          const minX = sectionInfo.startX + SECTION_BOX_MINIMUM_WIDTH;

          const endX = Math.max(minX, Math.min(maxX, newDivX));
          const endTime = pxToTimeObject(endX);

          setSectionInfo({ ...sectionInfo, endX, endTime });
        }
      }
    }

    function handleMouseUp() {
      setIsExpandDragging({ startTime: false, endTime: false });
      initialXRef.current = null;
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
      if (selectedSubtitleIndex === null) return;

      if (progressRef.current) {
        const scrollLeft = progressRef.current.scrollLeft;
        const progressWidth = progressRef.current.scrollWidth;
        if (isSubtitleExpandDragging.startTime && initialXRef.current !== null) {
          const newDivX = e.clientX + scrollLeft - initialXRef.current;
          const maxX = subtitleContentArray[selectedSubtitleIndex].endX - SECTION_BOX_MINIMUM_WIDTH;

          const startX = Math.max(0, Math.min(maxX, newDivX));
          const startTime = pxToTimeObject(startX);

          setSubtitleContentArray((prev) => {
            const updatedArray = [...prev];
            updatedArray[selectedSubtitleIndex] = { ...updatedArray[selectedSubtitleIndex], startTime, startX };
            return updatedArray;
          });
        }
        if (isSubtitleExpandDragging.endTime && initialXRef.current !== null) {
          const newDivX = e.clientX + scrollLeft - initialXRef.current;
          const maxX = progressWidth;
          const minX = subtitleContentArray[selectedSubtitleIndex].startX + SECTION_BOX_MINIMUM_WIDTH;

          const endX = Math.max(minX, Math.min(maxX, newDivX));
          const endTime = pxToTimeObject(endX);

          setSubtitleContentArray((prev) => {
            const updatedArray = [...prev];
            updatedArray[selectedSubtitleIndex] = { ...updatedArray[selectedSubtitleIndex], endTime, endX };
            return updatedArray;
          });
        }
      }
    }

    function handleMouseUp() {
      setIsSubtitleExpandDragging({ startTime: false, endTime: false });
      initialXRef.current = null;
    }

    if (isSubtitleExpandDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSubtitleExpandDragging]);

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

        const startX = Math.max(0, Math.min(startMaxX, sectionInfo.startX * resizeRatio));
        const endX = Math.max(0, Math.min(endMaxX, sectionInfo.endX * resizeRatio));
        const newProgressBarX = Math.max(0, Math.min(progressBarMaxX, prevProgressBarX.current * resizeRatio));

        const time = pxToSeconds(newProgressBarX);

        setSectionInfo({ ...sectionInfo, startX, endX });
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
    function handleChangeWitdhPercent() {
      if (!subtitleRef.current) return;

      for (let i = 0; i < subtitleRef.current.children.length; i++) {
        if (
          progressRef.current &&
          progressBarRef.current &&
          prevProgressWidthPercent.current &&
          videoRef.current &&
          subtitleContentArray[i]
        ) {
          const v = subtitleRef.current.children[i];
          const progressWidth = progressRef.current.scrollWidth;
          const sectionBoxWidth = v.clientWidth;

          const resizeRatio = progressWidthPercent / prevProgressWidthPercent.current;
          const startMaxX = progressWidth - sectionBoxWidth;
          const endMaxX = progressWidth;

          const startX = Math.max(0, Math.min(startMaxX, subtitleContentArray[i].startX * resizeRatio));
          const endX = Math.max(0, Math.min(endMaxX, subtitleContentArray[i].endX * resizeRatio));

          setSubtitleContentArray((prev) => {
            const updatedArray = [...prev];
            updatedArray[i] = { ...updatedArray[i], startX, endX };

            return updatedArray;
          });
        }
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

  useEffect(() => {
    if (progressRef.current) {
      const progressWidth = progressRef.current.clientWidth;
      const progressBarX = secondsToPx(videoProgress);
      const left = progressBarX - progressWidth / 2;

      progressRef.current?.scrollTo({ left, behavior: "smooth" });
    }
  }, [progressWidthPercent]);

  useEffect(() => {
    if (selectedTemplate && !selectedTemplate.options.title.none) {
      const { x1, y1, x2, y2, font, size, color, background, textOpacity, bgOpacity } = selectedTemplate.options.title;
      setTitleContent({
        ...titleContent,
        x1,
        y1,
        x2,
        y2,
        font,
        size,
        color,
        background,
        textOpacity,
        bgOpacity,
      });
    } else {
      setTitleContent({ ...DEFAULT_TITLE_CONTENT, text: titleContent.text });
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (selectedTemplate && !selectedTemplate.options.subtitle.none) {
      const { x1, y1, x2, y2, font, size, color, background, textOpacity, bgOpacity } =
        selectedTemplate.options.subtitle;

      setSubtitleContentArray((prev) => {
        const updatedArray = prev.map((v) => {
          return { ...v, x1, y1, x2, y2, font, size, color, background, textOpacity, bgOpacity };
        });
        return updatedArray;
      });
    } else {
      setSubtitleContentArray((prev) => {
        const updatedArray = prev.map((v) => {
          return {
            ...v,
            text: v.text,
            x1: 0,
            y1: 0.8,
            x2: 1,
            y2: 1,
            font: FONT_ARRAY[1],
            size: 20,
            color: "#ffffff",
            background: "#000000",
            textOpacity: 1,
            bgOpacity: 0,
          };
        });
        return updatedArray;
      });
    }
  }, [selectedTemplate]);

  useEffect(() => {
    const index = subtitleContentArray.findIndex(
      (v) => timeObjectToSeconds(v.startTime) <= videoProgress && timeObjectToSeconds(v.endTime) >= videoProgress
    );
    index === -1 ? setCurrentSubtitleIndex(null) : setCurrentSubtitleIndex(index);
  }, [videoProgress, subtitleContentArray]);

  // functions
  function handleTimeUpdate(time: number) {
    setVideoProgress(time);
  }

  function handleChangeVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const volume = Number(e.target.value);

    setVideoVolume(volume);

    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }

  function handleMute(isMute: boolean) {
    setIsMute(isMute);

    if (videoRef.current) {
      videoRef.current.muted = isMute;
    }
  }

  function handleMouseDownProgress(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (progressRef.current && progressBarRef.current && videoRef.current) {
      const maxX = (videoDuration * progressWidthPercent) / 100;

      const rect = progressRef.current.getBoundingClientRect();
      const scrollLeft = progressRef.current.scrollLeft;
      const x = e.clientX - rect.left + scrollLeft;
      const time = pxToSeconds(x);

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

      progressBarXRef.current = e.clientX - secondsToPx(videoProgress) + scrollLeft;
    }
  }

  function expandProgress() {
    setProgressWidthPercent((prev) => (prev === MAX_PERCENT ? prev : prev + WIDTH_PERCENT_STEP));
    prevProgressWidthPercent.current = progressWidthPercent;
  }

  function shrinkProgress() {
    setProgressWidthPercent((prev) => (prev === MIN_PERCENT ? prev : prev - WIDTH_PERCENT_STEP));
    prevProgressWidthPercent.current = progressWidthPercent;
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

      initialXRef.current = e.clientX - sectionInfo.startX + scrollLeft;
    }
  }

  function handleMouseDownStartExpand(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsExpandDragging({ ...isExpandDragging, startTime: true });

    if (progressRef.current) {
      const scrollLeft = progressRef.current.scrollLeft;

      initialXRef.current = e.clientX - sectionInfo.startX + scrollLeft;
    }
  }

  function handleMouseDownEndExpand(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsExpandDragging({ ...isExpandDragging, endTime: true });

    if (progressRef.current) {
      const scrollLeft = progressRef.current.scrollLeft;

      initialXRef.current = e.clientX - sectionInfo.endX + scrollLeft;
    }
  }

  function handleMouseDownSubtitleSectionBox(e: React.MouseEvent<HTMLDivElement>, index: number) {
    e.stopPropagation();
    setIsSubtitleDragging(true);
    setSelectedSubtitleIndex(index);

    if (progressRef.current && index !== undefined) {
      const scrollLeft = progressRef.current.scrollLeft;
      initialXRef.current = e.clientX - subtitleContentArray[index].startX + scrollLeft;
    }
  }

  function handleMouseDownSubtitleStartExpand(e: React.MouseEvent<HTMLDivElement>, index: number) {
    e.stopPropagation();
    setIsSubtitleExpandDragging({ ...isSubtitleExpandDragging, startTime: true });
    setSelectedSubtitleIndex(index);

    if (progressRef.current && selectedSubtitleIndex !== null) {
      const scrollLeft = progressRef.current.scrollLeft;
      initialXRef.current = e.clientX - subtitleContentArray[index].startX + scrollLeft;
    }
  }

  function handleMouseDownSubtitleEndExpand(e: React.MouseEvent<HTMLDivElement>, index: number) {
    e.stopPropagation();
    setIsSubtitleExpandDragging({ ...isSubtitleExpandDragging, endTime: true });
    setSelectedSubtitleIndex(index);

    if (progressRef.current && selectedSubtitleIndex !== null) {
      const scrollLeft = progressRef.current.scrollLeft;
      initialXRef.current = e.clientX - subtitleContentArray[index].endX + scrollLeft;
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

  function secondsToPx(time: number) {
    return (time * unitWidth) / SIXTY_SECONDS;
  }

  function pxToSeconds(px: number) {
    return (px / unitWidth) * SIXTY_SECONDS;
  }

  function timeObjectToPx(time: TimeObject) {
    return secondsToPx(timeObjectToSeconds(time));
  }

  function pxToTimeObject(px: number) {
    return secondsToTimeObject(pxToSeconds(px));
  }

  function handleChangeStartTimeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const startTime = { ...sectionInfo.startTime, [name]: value };
    setSectionInfo({ ...sectionInfo, startTime, startX: timeObjectToPx(startTime) });
  }

  function handleChangeEndTimeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const endTime = { ...sectionInfo.endTime, [name]: value };
    setSectionInfo({ ...sectionInfo, endTime, endX: timeObjectToPx(endTime) });
  }

  function correctStartTimeInput(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const newValue = getCorrectStartTime(sectionInfo.startTime, sectionInfo.endTime, name, value);

    const startTime = { ...sectionInfo.startTime, [name]: newValue.toString().padStart(2, "0") };
    setSectionInfo({
      ...sectionInfo,
      startTime,
      startX: timeObjectToPx(startTime),
    });
  }

  function correctEndTimeInput(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const newValue = getCorrectEndTime(sectionInfo.startTime, sectionInfo.endTime, videoDuration, name, value);

    const endTime = { ...sectionInfo.endTime, [name]: newValue.toString().padStart(2, "0") };
    setSectionInfo({
      ...sectionInfo,
      endTime,
      endX: timeObjectToPx(endTime),
    });
  }

  function handleClickPanel(panel: ActivePanel) {
    setActivePanel(panel);
  }

  function handleClickWorkMenu(workMenu: WorkMenu) {
    setSelectedWorkMenu(workMenu);
  }

  function handleClickAddTitle() {
    if (selectedTemplate && selectedTemplate.options.title.none) return;

    setHasTitle(true);

    if (selectedTemplate) {
      const { x1, y1, x2, y2, font, size, color, background, textOpacity, bgOpacity } = selectedTemplate.options.title;
      setTitleContent({
        text: "제목을 입력하세요.",
        x1,
        y1,
        x2,
        y2,
        font,
        size,
        color,
        background,
        textOpacity,
        bgOpacity,
      });
    }
  }

  function handleClickAddSubtitle() {
    if (selectedTemplate && selectedTemplate.options.title.none) return;

    const index = subtitleContentArray.findIndex((v) => {
      const startTime = timeObjectToSeconds(v.startTime);
      const endTime = timeObjectToSeconds(v.endTime);
      return startTime < videoProgress + DEFAULT_SUBTITLE_SEC && endTime + 1 > videoProgress;
    });

    if (index !== -1) return;

    const startTime = secondsToTimeObject(videoProgress);
    const endTime = secondsToTimeObject(videoProgress + DEFAULT_SUBTITLE_SEC);
    const startX = secondsToPx(videoProgress);
    const endX = secondsToPx(videoProgress + DEFAULT_SUBTITLE_SEC);

    if (selectedTemplate) {
      const { x1, y1, x2, y2, font, size, color, background, textOpacity, bgOpacity } =
        selectedTemplate.options.subtitle;
      setSubtitleContentArray([
        ...subtitleContentArray,
        {
          text: "자막을 입력하세요.",
          x1,
          y1,
          x2,
          y2,
          font,
          size,
          color,
          background,
          textOpacity,
          bgOpacity,
          startX,
          endX,
          startTime,
          endTime,
        },
      ]);
    } else {
      setSubtitleContentArray([
        ...subtitleContentArray,
        {
          text: "자막을 입력하세요.",
          x1: 0,
          y1: 0.8,
          x2: 1,
          y2: 1,
          font: FONT_ARRAY[1],
          size: 20,
          color: "#ffffff",
          background: "#000000",
          textOpacity: 1,
          bgOpacity: 0,
          startX,
          endX,
          startTime,
          endTime,
        },
      ]);
    }

    setSelectedSubtitleIndex(subtitleContentArray.length);
  }

  function handleClickDeleteTitle() {
    setHasTitle(false);
  }

  function handleClickDeleteSubtitle() {
    if (selectedSubtitleIndex !== null) {
      setSubtitleContentArray((prev) => {
        const updatedArray = prev.filter((v, i) => i !== selectedSubtitleIndex);
        return updatedArray;
      });

      setSelectedSubtitleIndex(null);
      setCurrentSubtitleIndex(null);
    }
  }

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (titleContent) {
      setTitleContent({ ...titleContent, [name]: value });
    }
  }

  function handleChangeSubtitle(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (selectedSubtitleIndex !== null) {
      setSubtitleContentArray((prev) => {
        const updatedArray = [...prev];
        updatedArray[selectedSubtitleIndex] = { ...prev[selectedSubtitleIndex], [name]: value };
        return updatedArray;
      });
    }
  }

  function handleChangeSubtitleStartTime(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (selectedSubtitleIndex !== null) {
      const startTime = { ...subtitleContentArray[selectedSubtitleIndex].startTime, [name]: value };

      setSubtitleContentArray((prev) => {
        const updatedArray = [...prev];
        updatedArray[selectedSubtitleIndex] = {
          ...prev[selectedSubtitleIndex],
          startTime,
          startX: timeObjectToPx(startTime),
        };
        return updatedArray;
      });
    }
  }

  function handleChangeSubtitleEndTime(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (selectedSubtitleIndex !== null) {
      const endTime = { ...subtitleContentArray[selectedSubtitleIndex].endTime, [name]: value };

      setSubtitleContentArray((prev) => {
        const updatedArray = [...prev];
        updatedArray[selectedSubtitleIndex] = {
          ...prev[selectedSubtitleIndex],
          endTime,
          endX: timeObjectToPx(endTime),
        };
        return updatedArray;
      });
    }
  }

  function correctSubtitleStartTimeInput(e: React.FocusEvent<HTMLInputElement>) {
    if (selectedSubtitleIndex === null) return;

    const { name, value } = e.target;
    const selectedSubtitle = subtitleContentArray[selectedSubtitleIndex ?? 0];
    const newValue = getCorrectStartTime(selectedSubtitle.startTime, selectedSubtitle.endTime, name, value);

    const startTime = {
      ...subtitleContentArray[selectedSubtitleIndex].startTime,
      [name]: newValue.toString().padStart(2, "0"),
    };

    setSubtitleContentArray((prev) => {
      const updatedArray = [...prev];
      updatedArray[selectedSubtitleIndex] = {
        ...prev[selectedSubtitleIndex],
        startTime,
        startX: timeObjectToPx(startTime),
      };
      return updatedArray;
    });
  }

  function correctSubtitleEndTimeInput(e: React.FocusEvent<HTMLInputElement>) {
    if (selectedSubtitleIndex === null) return;

    const { name, value } = e.target;
    const selectedSubtitle = subtitleContentArray[selectedSubtitleIndex ?? 0];
    const newValue = getCorrectEndTime(
      selectedSubtitle.startTime,
      selectedSubtitle.endTime,
      videoDuration,
      name,
      value
    );

    const endTime = {
      ...subtitleContentArray[selectedSubtitleIndex].endTime,
      [name]: newValue.toString().padStart(2, "0"),
    };

    setSubtitleContentArray((prev) => {
      const updatedArray = [...prev];
      updatedArray[selectedSubtitleIndex] = {
        ...prev[selectedSubtitleIndex],
        endTime,
        endX: timeObjectToPx(endTime),
      };
      return updatedArray;
    });
  }

  function handleClickTemplate(template?: Template) {
    setSelectedTemplate(template ?? null);
  }

  function handleClickBgm(bgm?: Bgm) {
    setSelectedBgm(bgm ?? null);
  }

  function handleClickSubtitleInput(index: number) {
    setSelectedSubtitleIndex(index);
  }

  function scrollToProgressBar() {
    if (progressRef.current) {
      const progressWidth = progressRef.current.clientWidth;
      const progressBarX = secondsToPx(videoProgress);
      const left = progressBarX - progressWidth / 2;

      progressRef.current?.scrollTo({ left, behavior: "smooth" });
    }
  }

  function moveSectionBoxToProgressBar() {
    if (sectionBoxRef.current) {
      const sectionBoxWidth = sectionBoxRef.current.clientWidth;
      const maxEndX = secondsToPx(videoDuration);

      const startX = secondsToPx(videoProgress);
      const endX = Math.min(startX + sectionBoxWidth, maxEndX);
      const startTime = secondsToTimeObject(videoProgress);
      const endTime = pxToTimeObject(startX);

      setSectionInfo({ startX, endX, startTime, endTime });
    }
  }

  return (
    <div className="grid grid-rows-[1fr,60px,240px] h-full">
      <div className="grid grid-cols-[340px,1fr] border-b">
        <div className="border-r flex flex-col">
          <TabMenu
            selectedWorkMenu={selectedWorkMenu}
            handleClickWorkMenu={handleClickWorkMenu}
            handleClickPanel={handleClickPanel}
          />
          {selectedWorkMenu === "template" && (
            <TemplateMenu
              templateList={templateList}
              selectedTemplateId={selectedTemplate?.templateId ?? ""}
              handleClickTemplate={handleClickTemplate}
              handleClickPanel={handleClickPanel}
            />
          )}
          {selectedWorkMenu === "title" && (
            <TitleMenu
              titleContent={titleContent}
              disabled={!!selectedTemplate}
              hasTitle={hasTitle}
              none={selectedTemplate?.options.title.none ?? false}
              handleClickAddTitle={handleClickAddTitle}
              handleClickDeleteTitle={handleClickDeleteTitle}
              handleChangeTitle={handleChangeTitle}
              handleClickWorkMenu={handleClickWorkMenu}
              handleClickPanel={handleClickPanel}
            />
          )}
          {selectedWorkMenu === "subtitle" && (
            <SubtitleMenu
              subtitleContentArray={subtitleContentArray}
              disabled={!!selectedTemplate}
              none={selectedTemplate?.options.subtitle.none ?? false}
              selectedSubtitleIndex={selectedSubtitleIndex}
              handleClickAddSubtitle={handleClickAddSubtitle}
              handleClickDeleteSubtitle={handleClickDeleteSubtitle}
              handleChangeSubtitle={handleChangeSubtitle}
              handleChangeSubtitleStartTime={handleChangeSubtitleStartTime}
              handleChangeSubtitleEndTime={handleChangeSubtitleEndTime}
              handleClickWorkMenu={handleClickWorkMenu}
              handleClickPanel={handleClickPanel}
              correctSubtitleStartTimeInput={correctSubtitleStartTimeInput}
              correctSubtitleEndTimeInput={correctSubtitleEndTimeInput}
            />
          )}
          {selectedWorkMenu === "bgm" && (
            <BgmMenu
              bgmList={bgmList}
              selectedBgmId={selectedBgm?.bgmId ?? ""}
              handleClickBgm={handleClickBgm}
              handleClickWorkMenu={handleClickWorkMenu}
              handleClickPanel={handleClickPanel}
            />
          )}
        </div>

        <div
          onClick={() => {
            handleClickPanel("video");
          }}
          className="grid grid-rows-[1fr,60px] max-w-[calc(100vw-340px)]"
        >
          <VideoArea
            videoAreaRef={videoAreaRef}
            videoRef={videoRef}
            templateImageRef={templateImageRef}
            loaded={loaded}
            hasTitle={hasTitle}
            templateImageSize={templateImageSize}
            selectedTemplate={selectedTemplate}
            titleContent={titleContent}
            subtitleContentArray={subtitleContentArray}
            selectedSubtitleIndex={selectedSubtitleIndex}
            currentSubtitleIndex={currentSubtitleIndex}
            videoSrc={videoSrc}
            videoX={videoX}
            videoProgress={videoProgress}
            handleChangeTitle={handleChangeTitle}
            handleChangeSubtitle={handleChangeSubtitle}
            handleClickWorkMenu={handleClickWorkMenu}
            handleMouseDownVideo={handleMouseDownVideo}
            handleLoadedMetadata={handleLoadedMetadata}
            handleTimeUpdate={handleTimeUpdate}
            handleClickPanel={handleClickPanel}
            handleClickSubtitleInput={handleClickSubtitleInput}
            handlePause={() => setIsPlay(false)}
            handlePlay={() => setIsPlay(true)}
          />

          <VideoControlBar
            videoProgress={videoProgress}
            videoDuration={videoDuration}
            videoVolume={videoVolume}
            isPlay={isPlay}
            isMute={isMute}
            handleBack={handleBack}
            handleFoward={handleFoward}
            handlePlay={handlePlay}
            handleChangeVolume={handleChangeVolume}
            handleMute={handleMute}
          />
        </div>
      </div>

      <SectionControlBar
        startTimeInput={sectionInfo.startTime}
        endTimeInput={sectionInfo.endTime}
        progressWidthPercent={progressWidthPercent}
        handleChangeStartTimeInput={handleChangeStartTimeInput}
        handleChangeEndTimeInput={handleChangeEndTimeInput}
        expandProgress={expandProgress}
        shrinkProgress={shrinkProgress}
        scrollToProgressBar={scrollToProgressBar}
        moveSectionBoxToProgressBar={moveSectionBoxToProgressBar}
        correctStartTimeInput={correctStartTimeInput}
        correctEndTimeInput={correctEndTimeInput}
      />

      <div
        ref={progressRef}
        onMouseDown={handleMouseDownProgress}
        className="relative grid grid-rows-[32px,8px,200px] max-w-[3000px] overflow-x-scroll"
      >
        <TimeLine unitWidth={unitWidth} />

        <div className="w-full h-2 bg-slate-200"></div>

        <div className="h-full bg-slate-50">
          {/* section */}
          <div className="relative h-1/4 border-b border-slate-300">
            <SectionBox
              sectionBoxRef={sectionBoxRef}
              startX={sectionInfo.startX}
              endX={sectionInfo.endX}
              lineType="video"
              isActive={activePanel === "video"}
              handleMouseDownSectionBox={(e) => {
                handleMouseDownSectionBox(e);
                handleClickPanel("video");
              }}
              handleMouseDownStartExpand={handleMouseDownStartExpand}
              handleMouseDownEndExpand={handleMouseDownEndExpand}
            />
          </div>

          {/* title */}
          <div className="relative h-1/4 border-b border-slate-300">
            {hasTitle && titleContent && (
              <SectionBox
                sectionBoxRef={sectionBoxRef}
                startX={sectionInfo.startX}
                endX={sectionInfo.endX}
                lineType="title"
                isActive={activePanel === "title"}
                text={titleContent.text}
                handleMouseDownSectionBox={(e) => {
                  handleMouseDownSectionBox(e);
                  handleClickPanel("title");
                  handleClickWorkMenu("title");
                }}
                handleMouseDownStartExpand={handleMouseDownStartExpand}
                handleMouseDownEndExpand={handleMouseDownEndExpand}
              />
            )}
          </div>

          {/* subtitle */}
          <div ref={subtitleRef} className="relative h-1/4 border-b border-slate-300">
            {subtitleContentArray.map((v, i) => (
              <SectionBox
                key={i}
                startX={v.startX}
                endX={v.endX}
                lineType="subtitle"
                isActive={activePanel === "subtitle"}
                text={v.text}
                isSelected={i === selectedSubtitleIndex}
                handleMouseDownSectionBox={(e) => {
                  handleMouseDownSubtitleSectionBox(e, i);
                  handleClickPanel("subtitle");
                  handleClickWorkMenu("subtitle");
                }}
                handleMouseDownStartExpand={(e) => {
                  handleMouseDownSubtitleStartExpand(e, i);
                }}
                handleMouseDownEndExpand={(e) => {
                  handleMouseDownSubtitleEndExpand(e, i);
                }}
              />
            ))}
          </div>

          {/* bgm */}
          <div className="relative h-1/4 border-b border-slate-300">
            {selectedBgm && (
              <SectionBox
                sectionBoxRef={sectionBoxRef}
                startX={sectionInfo.startX}
                endX={sectionInfo.endX}
                lineType="bgm"
                isActive={activePanel === "bgm"}
                text={selectedBgm.title}
                handleMouseDownSectionBox={(e) => {
                  handleMouseDownSectionBox(e);
                  handleClickPanel("bgm");
                  handleClickWorkMenu("bgm");
                }}
                handleMouseDownStartExpand={handleMouseDownStartExpand}
                handleMouseDownEndExpand={handleMouseDownEndExpand}
              />
            )}
          </div>
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
