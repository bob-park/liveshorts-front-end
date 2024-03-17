"use client";

import { useState } from "react";

export default function CreateShorts() {
	const [currentTime, setCurrentTime] = useState(0);
	const [videoDuration, setVideoDuration] = useState(0);

	return (
		<div className="grid grid-rows-[1fr,300px] h-full">
			<div className="grid grid-cols-[300px,1fr] border-b">
				<div className="border-r">작업 패널</div>
				<div className="">
					<video
						controls
						src="../../dummy/dummy.mp4"
						onTimeUpdate={(e) => {
							setCurrentTime(e.currentTarget.currentTime);
						}}
						onLoadedMetadata={(e) => {
							setVideoDuration(e.currentTarget.duration);
						}}
						className="w-full"
					></video>
				</div>
			</div>
			<div className="relative">
				<div
					style={{ left: `${(currentTime / videoDuration) * 100}%` }}
					className="w-1 h-full bg-neutral-500 absolute"
				></div>
			</div>
		</div>
	);
}
