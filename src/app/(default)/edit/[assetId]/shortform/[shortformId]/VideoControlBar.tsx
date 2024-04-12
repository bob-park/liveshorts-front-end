import { IoPause, IoPlay, IoPlayBack, IoPlayForward } from "react-icons/io5";
import IconButton from "./IconButton";

import { secondsToHhmmss } from "./util";

interface VideoControlBarProps {
  videoProgress: number;
  videoDuration: number;
  isPlay: boolean;
  handleBack: () => void;
  handleFoward: () => void;
  handlePlay: () => void;
}

export default function VideoControlBar({
  videoProgress,
  videoDuration,
  isPlay,
  handleBack,
  handleFoward,
  handlePlay,
}: VideoControlBarProps) {
  return (
    <div className="flex items-center justify-between w-full py-2 px-5 border-t">
      <div className="flex items-center gap-3">
        <span>{secondsToHhmmss(videoProgress)}</span>
        <span>{secondsToHhmmss(videoDuration)}</span>
      </div>

      <div className="flex items-center">
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
