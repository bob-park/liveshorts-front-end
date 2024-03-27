"use client";

import { useEffect, useRef, useState } from "react";
import { FaMagnifyingGlassPlus, FaMagnifyingGlassMinus } from "react-icons/fa6";

const TEST_ASSET_ID = "20";
const MAX_PERCENT = 200;
const MIN_PERCENT = 100;
const DEFAULT_SECTION_PX = 600;

export default function EditShorts() {
	// useRef
	const videoRef = useRef<HTMLVideoElement>(null);
	const progressRef = useRef<HTMLDivElement>(null);
	const sectionBoxRef = useRef<HTMLDivElement>(null);
	const startXRef = useRef<number | null>(null);
	const endXRef = useRef<number | null>(null);
	const prevStartX = useRef<number>(0);
	const prevEndX = useRef<number>(600);
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

	function pxToTime(px: number) {
		return (px / videoDuration) * (progressRef.current?.clientWidth ?? 0);
	}

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
							width: `${pxToTime(endX - startX)}px`,
							height: "25%",
							left: `${pxToTime(startX)}px`,
						}}
						onMouseDown={handleMouseDown}
						className={`
			absolute top-0 opacity-30 hover:opacity-60
			cursor-grab group
			flex justify-between
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
			</div>
		</div>
	);
}
