import { ActivePanel, TitleContent } from "../EditShorts";
import { hexToRgba } from "../util";

interface TitleInputProps {
  title: TitleContent;
  handleChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickPanel(): void;
}

export default function TitleInput({ title, handleChangeTitle, handleClickPanel }: TitleInputProps) {
  const { text, x1, y1, x2, y2, font, size, color, background, textOpacity, bgOpacity } = title;

  return (
    <input
      name="text"
      type="text"
      autoFocus
      value={text}
      style={{
        left: `${x1 * 100}%`,
        right: `${100 - x2 * 100}%`,
        top: `${y1 * 100}%`,
        bottom: `${100 - y2 * 100}%`,
        fontFamily: font,
        fontSize: `${size}px`,
        color: hexToRgba(color, textOpacity),
        background: hexToRgba(background, bgOpacity),
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleClickPanel();
      }}
      onChange={handleChangeTitle}
      className={`
  absolute z-50
  text-center
  focus:outline-none
  `}
    />
  );
}
