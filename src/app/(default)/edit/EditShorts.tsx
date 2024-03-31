"use client";

import { useEffect, useRef, useState } from "react";
import { FaMagnifyingGlassPlus, FaMagnifyingGlassMinus } from "react-icons/fa6";
import { IoPause, IoPlay, IoPlayBack, IoPlayForward } from "react-icons/io5";
import IconButton from "./IconButton";

type LineType = "video" | "bgm" | "title" | "subtitle";

const TEST_ASSET_ID = "20";
const MAX_PERCENT = 200;
const MIN_PERCENT = 100;
const DEFAULT_SECTION_SEC = 600;
const WIDTH_PERCENT_STEP = 25;

export default function EditShorts() {
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

	// useState
	// const [videoProgress, setVideoProgress] = useState<number>(0);
	const [videoDuration, setVideoDuration] = useState(0);
	const [isPlay, setIsPlay] = useState(false);
	const [progressBarX, setProgressBarX] = useState(0);
	const [startX, setStartX] = useState(0);
	const [endX, setEndX] = useState(0);
	const [isProgressBarDragging, setIsProgressBarDragging] = useState(false);
	const [isSectionBoxDragging, setIsSectionBoxDragging] = useState(false);
	const [isExpandDragging, setIsExpandDragging] = useState({ startTime: false, endTime: false });
	const [progressWidthPercent, setProgressWidthPercent] = useState(MIN_PERCENT);
	const [selectedLine, setSelctedLine] = useState<LineType | null>(null);

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

				// handleMouseDownProgress함수와 연관된 버그 해결

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

	useEffect(() => {
		if (videoRef.current) {
			const time = pxToTime(progressBarX);
			videoRef.current.currentTime = time;
			// setVideoProgress(time);
		}
	}, [progressBarX]);

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
	}

	function shrinkProgress() {
		setProgressWidthPercent((prev) => (prev === MIN_PERCENT ? prev : prev - WIDTH_PERCENT_STEP));
		prevProgressWidthPercent.current = progressWidthPercent;
	}

	function handleLoadedMetadata(e: React.SyntheticEvent<HTMLVideoElement>) {
		setVideoDuration(e.currentTarget.duration);
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

				<div
					onClick={() => {
						setSelctedLine(null);
					}}
					className="flex flex-col gap-4 justify-center items-center"
				>
					<div className="h-[calc(100lvh-500px)] max-h-[calc(100lvh-500px)]">
						<video
							controls
							ref={videoRef}
							src={`/api/v1/asset/${TEST_ASSET_ID}/resource?fileType=HI_RES&t=${new Date().getTime}`}
							// onTimeUpdate={(e) => setVideoProgress((e.currentTarget.currentTime / videoDuration) * 100)}
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
				<IconButton
					toolTip={`${WIDTH_PERCENT_STEP}% 확대`}
					onClick={expandProgress}
					Icon={<FaMagnifyingGlassPlus />}
				></IconButton>
				<IconButton
					toolTip={`${WIDTH_PERCENT_STEP}% 축소`}
					onClick={shrinkProgress}
					Icon={<FaMagnifyingGlassMinus />}
				></IconButton>
			</div>

			<div className="grid grid-rows-[50px,200px] overflow-x-scroll">
				<div>줄자</div>
				<div
					ref={progressRef}
					style={{ width: `${progressWidthPercent}%` }}
					onMouseDown={handleMouseDownProgress}
					onClick={() => {
						setSelctedLine("video");
					}}
					className="relative bg-slate-50"
				>
					{/* section */}
					<div
						ref={sectionBoxRef}
						style={{
							width: `${endX - startX}px`,
							left: `${startX}px`,
							height: "25%",
						}}
						onMouseDown={handleMouseDownSectionBox}
						className={`
			          absolute top-0 flex justify-between h-full
			          cursor-grab rounded-lg
                group
                bg-slate-200
			          `}
					>
						<div
							onMouseDown={handleMouseDownStartExpand}
							style={{ width: `${(progressRef.current?.clientWidth ?? 0) / 50}px` }}
							className={`
			            cursor-w-resize
									rounded-l-lg
									${selectedLine !== "video" && "group-hover:opacity-50"}
									${selectedLine === "video" ? " opacity-100" : "opacity-0"}
			          bg-slate-600
								`}
						></div>
						<div
							className={`
							w-full
						inset-0 border-t-4 border-b-4 box-content border-opacity-0
						${selectedLine !== "video" && "group-hover:border-opacity-50"}
						${selectedLine === "video" ? " border-opacity-100" : "border-opacity-0"}
								border-slate-600
								`}
						></div>
						<div
							onMouseDown={handleMouseDownEndExpand}
							style={{ width: `${(progressRef.current?.clientWidth ?? 0) / 50}px` }}
							className={`
			            cursor-e-resize
									rounded-r-lg
									${selectedLine !== "video" && "group-hover:opacity-50"}
									${selectedLine === "video" ? " opacity-100" : "opacity-0"}
			          bg-slate-600
								`}
						></div>
					</div>

					<div
						ref={progressBarRef}
						style={{
							left: `${progressBarX}px`,
						}}
						onMouseDown={handleMouseDownProgressBar}
						className={`
					w-1 h-full absolute
					cursor-pointer
					bg-red-700 `}
					></div>
				</div>
			</div>
		</div>
	);
}
