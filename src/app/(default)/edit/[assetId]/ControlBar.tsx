import TimeInput, { TimeObject } from "@/components/edit/TimeInput";
import { FaMagnifyingGlassPlus, FaMagnifyingGlassMinus } from "react-icons/fa6";
import { IoPause, IoPlay, IoPlayBack, IoPlayForward } from "react-icons/io5";
import IconButton from "./IconButton";
import { WIDTH_PERCENT_STEP } from "./EditShorts";

interface ControlBarProps {
  startTimeInput: TimeObject;
  endTimeInput: TimeObject;
  isPlay: boolean;
  progressWidthPercent: number;
  handleChangeStartTimeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeEndTimeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBack: () => void;
  handleFoward: () => void;
  handlePlay: () => void;
  expandProgress: () => void;
  shrinkProgress: () => void;
}

export default function ControlBar({
  startTimeInput,
  endTimeInput,
  isPlay,
  progressWidthPercent,
  handleChangeStartTimeInput,
  handleChangeEndTimeInput,
  handleBack,
  handleFoward,
  handlePlay,
  expandProgress,
  shrinkProgress,
}: ControlBarProps) {
  return (
    <div className="flex items-center justify-between w-full p-3 border-t">
      <div className="flex items-center gap-3">
        <TimeInput value={startTimeInput} handleChange={handleChangeStartTimeInput} />
        <TimeInput value={endTimeInput} handleChange={handleChangeEndTimeInput} />
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
    </div>
  );
}
