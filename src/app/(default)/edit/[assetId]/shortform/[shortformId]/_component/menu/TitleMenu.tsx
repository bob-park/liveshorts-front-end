import { TitleContent, WorkMenu } from "../type";
import TitleItem from "./TitleItem";

interface TitleMenuProps {
  titleContent: TitleContent | null;
  disabled: boolean;
  hasTitle: boolean;
  none: boolean;
  handleClickAddTitle: () => void;
  handleClickDeleteTitle: () => void;
  handleChangeTitle: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleClickWorkMenu(workMenu: WorkMenu): void;
}

export default function TitleMenu({
  titleContent,
  disabled,
  hasTitle,
  none,
  handleClickAddTitle,
  handleClickDeleteTitle,
  handleChangeTitle,
  handleClickWorkMenu,
}: TitleMenuProps) {
  return (
    <div
      onClick={() => {
        handleClickWorkMenu("title");
      }}
      className="relative h-full p-2 flex flex-col gap-2"
    >
      <button disabled={hasTitle || none} onClick={handleClickAddTitle} className="btn w-full">
        + 제목 추가
      </button>
      <div className="h-[calc(100vh-500px)] overflow-y-scroll">
        {hasTitle && titleContent && !none && (
          <TitleItem
            title={titleContent}
            disabled={disabled}
            handleClickDeleteTitle={handleClickDeleteTitle}
            handleChangeTitle={handleChangeTitle}
          />
        )}
      </div>
    </div>
  );
}
