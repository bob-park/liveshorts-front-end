import {
  IoPause,
  IoPlay,
  IoPlayBack,
  IoPlayForward,
  IoVolumeHigh,
  IoVolumeLow,
  IoVolumeMedium,
  IoVolumeMute,
  IoVolumeOff,
} from "react-icons/io5";
import IconButton from "./IconButton";

import { secondsToHhmmss } from "./util";

interface VideoControlBarProps {
  videoProgress: number;
  videoDuration: number;
  videoVolume: number;
  isPlay: boolean;
  isMute: boolean;
  handleBack: () => void;
  handleFoward: () => void;
  handlePlay: () => void;
  handleChangeVolume: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMute: (isMute: boolean) => void;
}

export default function VideoControlBar({
  videoProgress,
  videoDuration,
  videoVolume,
  isPlay,
  isMute,
  handleBack,
  handleFoward,
  handlePlay,
  handleChangeVolume,
  handleMute,
}: VideoControlBarProps) {
  return (
    <div className="flex items-center justify-between w-full py-2 px-5 border-t">
      <div className="flex items-center gap-3 font-semibold text-lg">
        <span className="text-slate-800 block w-20">{secondsToHhmmss(videoProgress)}</span> /
        <span className="text-slate-500">{secondsToHhmmss(videoDuration)}</span>
      </div>

      <div className="flex items-center gap-2">
        <IconButton toolTip="10초 뒤로" onClick={handleBack} Icon={<IoPlayBack />} />
        <IconButton toolTip={isPlay ? "정지" : "재생"} onClick={handlePlay} Icon={isPlay ? <IoPause /> : <IoPlay />} />
        <IconButton toolTip="10초 앞으로" onClick={handleFoward} Icon={<IoPlayForward />} />
      </div>

      <div className="flex items-center gap-4">
        <IconButton
          toolTip={isMute ? "음소거 해제" : "음소거"}
          onClick={() => handleMute(!isMute)}
          Icon={<VolumeIcon mute={isMute} volume={videoVolume} />}
        />
        <input
          className="range range-xs"
          type="range"
          min={0}
          max="100"
          value={isMute ? 0 : videoVolume}
          onChange={handleChangeVolume}
        />
      </div>
    </div>
  );
}

function VolumeIcon(props: { volume: number; mute: boolean }) {
  const { volume, mute } = props;

  if (mute) {
    return <IoVolumeMute className="w-5 h-5" />;
  }

  if (volume > 90) {
    return <IoVolumeHigh className="w-5 h-5" />;
  } else if (volume > 50) {
    return <IoVolumeMedium className="w-5 h-5" />;
  } else if (volume > 20) {
    return <IoVolumeLow className="w-5 h-5" />;
  } else {
    return <IoVolumeOff className="w-5 h-5" />;
  }
}
