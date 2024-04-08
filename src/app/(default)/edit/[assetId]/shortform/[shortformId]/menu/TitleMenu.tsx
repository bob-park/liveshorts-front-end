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
    <div className="relative h-full p-2">
      {!titleContent && (
        <button disabled={!!titleContent} onClick={handleClickAddTitle} className="btn w-full">
          + 제목 추가
        </button>
      )}
      {titleContent && (
        <TitleItem
          title={titleContent}
          optionArray={optionArray}
          handleClickDeleteTitle={handleClickDeleteTitle}
          handleChangeTitle={handleChangeTitle}
          handleClickWorkMenu={() => {
            handleClickWorkMenu("title");
          }}
        />
      )}
    </div>
  );
}
