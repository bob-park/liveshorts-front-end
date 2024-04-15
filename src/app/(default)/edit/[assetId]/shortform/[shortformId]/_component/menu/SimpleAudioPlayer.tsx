"use client";

import { useRef, useState } from "react";
import IconButton from "../IconButton";
import { IoPause, IoPlay, IoPlayBack, IoPlayForward } from "react-icons/io5";
import { FORWARD_BACKWARD_STEP_SECONDS } from "../EditShorts";
import { secondsToMmss } from "../util";

interface SimpleAudioPlayerProps {
  src: string;
}

export default function SimpleAudioPlayer({ src }: SimpleAudioPlayerProps) {
  // useRef
  const audioRef = useRef<HTMLAudioElement>(null);

  // useState
  const [isPlay, setIsPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // functions
  function handleAudioLoadedMetadata() {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  }

  function handlePlay() {
    !isPlay ? audioRef.current?.play() : audioRef.current?.pause();
  }

  function handleBack() {
    if (audioRef.current) {
      audioRef.current.currentTime -= FORWARD_BACKWARD_STEP_SECONDS;
    }
  }

  function handleFoward() {
    if (audioRef.current) {
      audioRef.current.currentTime += FORWARD_BACKWARD_STEP_SECONDS;
    }
  }

  function handleCurrentTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!audioRef.current) return;
    const newTime = Math.ceil(parseInt(event.target.value));
    audioRef.current.currentTime = newTime;
  }

  function handleAudioTimeUpdate() {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  }

  return (
    <div className="self-center w-full flex flex-col gap-3 items-center">
      <audio
        ref={audioRef}
        src={src}
        onPause={() => setIsPlay(false)}
        onPlay={() => setIsPlay(true)}
        onLoadedMetadata={handleAudioLoadedMetadata}
        onTimeUpdate={handleAudioTimeUpdate}
      ></audio>

      <input
        type="range"
        value={currentTime}
        max={duration}
        onChange={handleCurrentTimeChange}
        className="w-full range"
      />

      <div className="flex items-center justify-between w-full text-sm">
        <span>{secondsToMmss(currentTime)}</span>
        <span>{secondsToMmss(duration)}</span>
      </div>

      <div className="flex gap-3">
        <IconButton toolTip="10초 뒤로" onClick={handleBack} Icon={<IoPlayBack />}></IconButton>
        <IconButton
          toolTip={isPlay ? "정지" : "재생"}
          onClick={handlePlay}
          Icon={isPlay ? <IoPause /> : <IoPlay />}
        ></IconButton>
        <IconButton toolTip="10초 앞으로" onClick={handleFoward} Icon={<IoPlayForward />}></IconButton>
      </div>
    </div>
  );
}
