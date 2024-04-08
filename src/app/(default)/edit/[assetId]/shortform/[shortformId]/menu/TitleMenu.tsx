import { TitleContent, WorkMenu } from "../type";
import TitleItem from "./TitleItem";

interface TitleMenuProps {
  titleContent: TitleContent | null;
  optionArray: string[];
  handleClickAddTitle: () => void;
  handleClickDeleteTitle: () => void;
  handleChangeTitle: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleClickWorkMenu(workMenu: WorkMenu): void;
}

export default function TitleMenu({
  titleContent,
  optionArray,
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
      <button disabled={!!titleContent} onClick={handleClickAddTitle} className="btn w-full">
        + 제목 추가
      </button>

      <div className="h-[calc(100vh-440px)] overflow-y-scroll">
        {titleContent && (
          <TitleItem
            title={titleContent}
            optionArray={optionArray}
            handleClickDeleteTitle={handleClickDeleteTitle}
            handleChangeTitle={handleChangeTitle}
          />
        )}
      </div>
    </div>
  );
}
