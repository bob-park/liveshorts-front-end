import { Template, TitleContent, WorkMenu } from "../type";
import { hexToRgba } from "../util";

const SHORTS_WIDTH = 720;

interface TitleInputProps {
  title: TitleContent;
  templateWidth: number;
  handleChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickPanel(): void;
  handleClickWorkMenu(workMenu: WorkMenu): void;
}

export default function TitleInput({
  title,
  templateWidth,
  handleChangeTitle,
  handleClickPanel,
  handleClickWorkMenu,
}: TitleInputProps) {
  const { text, x1, y1, x2, y2, font, size, color, background, textOpacity, bgOpacity } = title;

  return (
    <div
      style={{
        left: `${x1 * 100}%`,
        right: `${100 - x2 * 100}%`,
        top: `${y1 * 100}%`,
        bottom: `${100 - y2 * 100}%`,
        background: hexToRgba(background, bgOpacity),
      }}
      className="absolute z-40 flex justify-center"
    >
      <input
        name="text"
        type="text"
        autoFocus
        value={text}
        style={{
          fontFamily: font,
          fontSize: `${(size / SHORTS_WIDTH) * templateWidth}px`,
          color: hexToRgba(color, textOpacity),
          background: "none",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleClickPanel();
          handleClickWorkMenu("title");
        }}
        onChange={handleChangeTitle}
        className={`
        z-50 focus:outline-none text-center h-fit
        `}
      />
    </div>
  );
}
