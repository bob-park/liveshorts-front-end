import { ActivePanel, SubtitleContent, WorkMenu } from "../type";
import SubtitleItem from "./SubtitleItem";

interface SubtitleMenuProps {
  subtitleContentArray: SubtitleContent[];
  disabled: boolean;
  none: boolean;
  selectedSubtitleIndex: number | null;
  handleClickAddSubtitle(): void;
  handleClickDeleteSubtitle(): void;
  handleChangeSubtitle(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void;
  handleChangeSubtitleStartTime(e: React.ChangeEvent<HTMLInputElement>): void;
  handleChangeSubtitleEndTime(e: React.ChangeEvent<HTMLInputElement>): void;
  handleClickWorkMenu(workMenu: WorkMenu): void;
  handleClickPanel(panel: ActivePanel): void;
  correctSubtitleStartTimeInput(e: React.FocusEvent<HTMLInputElement>): void;
  correctSubtitleEndTimeInput(e: React.FocusEvent<HTMLInputElement>): void;
}

export default function SubtitleMenu({
  subtitleContentArray,
  disabled,
  none,
  selectedSubtitleIndex,
  handleClickAddSubtitle,
  handleClickDeleteSubtitle,
  handleChangeSubtitle,
  handleChangeSubtitleStartTime,
  handleChangeSubtitleEndTime,
  handleClickWorkMenu,
  handleClickPanel,
  correctSubtitleStartTimeInput,
  correctSubtitleEndTimeInput,
}: SubtitleMenuProps) {
  return (
    <div
      onClick={() => {
        handleClickWorkMenu("subtitle");
        handleClickPanel("subtitle");
      }}
      className="relative h-full p-2 flex flex-col gap-2"
    >
      <button disabled={none} onClick={handleClickAddSubtitle} className="btn w-full">
        + 자막 추가
      </button>
      <div className="h-[calc(100vh-500px)] overflow-y-scroll">
        {subtitleContentArray.length > 0 && !none && selectedSubtitleIndex !== null && (
          <SubtitleItem
            subtitle={subtitleContentArray[selectedSubtitleIndex]}
            disabled={disabled}
            handleClickDeleteSubtitle={handleClickDeleteSubtitle}
            handleChangeSubtitle={handleChangeSubtitle}
            handleChangeSubtitleStartTime={handleChangeSubtitleStartTime}
            handleChangeSubtitleEndTime={handleChangeSubtitleEndTime}
            correctSubtitleStartTimeInput={correctSubtitleStartTimeInput}
            correctSubtitleEndTimeInput={correctSubtitleEndTimeInput}
          />
        )}
      </div>
    </div>
  );
}
