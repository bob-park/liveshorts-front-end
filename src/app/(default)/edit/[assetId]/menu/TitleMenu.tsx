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

      {!titleContent && (
        <button disabled={!!titleContent} onClick={handleClickAddTitle} className="btn absolute bottom-4 right-4">
          + 제목 추가
        </button>
      )}
    </div>
  );
}
