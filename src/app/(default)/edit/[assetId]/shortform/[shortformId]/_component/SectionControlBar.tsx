import TimeInput from "@/components/edit/TimeInput";
import { WIDTH_PERCENT_STEP } from "./EditShorts";
import { FaMagnifyingGlassPlus, FaMagnifyingGlassMinus } from "react-icons/fa6";
import { LuArrowLeftToLine } from "react-icons/lu";
import { RxAlignCenterVertically } from "react-icons/rx";
import IconButton from "./IconButton";
import { TimeObject } from "./type";

interface SectionControlBarProps {
  startTimeInput: TimeObject;
  endTimeInput: TimeObject;
  progressWidthPercent: number;
  handleChangeStartTimeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeEndTimeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  expandProgress: () => void;
  shrinkProgress: () => void;
  scrollToProgressBar: () => void;
  moveSectionBoxToProgressBar: () => void;
  correctStartTimeInput(e: React.FocusEvent<HTMLInputElement>): void;
  correctEndTimeInput(e: React.FocusEvent<HTMLInputElement>): void;
}

export default function SectionControlBar({
  startTimeInput,
  endTimeInput,
  progressWidthPercent,
  handleChangeStartTimeInput,
  handleChangeEndTimeInput,
  expandProgress,
  shrinkProgress,
  scrollToProgressBar,
  moveSectionBoxToProgressBar,
  correctStartTimeInput,
  correctEndTimeInput,
}: SectionControlBarProps) {
  return (
    <div className="py-2 px-5 flex items-center justify-between">
      <div className="flex gap-2">
        <IconButton toolTip="재생 위치로 이동" onClick={scrollToProgressBar} Icon={<RxAlignCenterVertically />} />
        <IconButton
          toolTip="재생 위치로 구간 설정"
          onClick={moveSectionBoxToProgressBar}
          Icon={<LuArrowLeftToLine />}
        />
      </div>

      <div className="flex gap-3 items-center">
        <TimeInput
          value={startTimeInput}
          handleChange={handleChangeStartTimeInput}
          correctInput={correctStartTimeInput}
        />
        /
        <TimeInput value={endTimeInput} handleChange={handleChangeEndTimeInput} correctInput={correctEndTimeInput} />
      </div>

      <div className="flex items-center select-none gap-2">
        <span className="mr-2 border rounded-md px-2 py-1 border-slate-400 text-slate-400">
          {progressWidthPercent}%
        </span>
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
