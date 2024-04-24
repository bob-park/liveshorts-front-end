import { SubtitleContent, WorkMenu } from "../type";
import { hexToRgba } from "../util";
import { SHORTS_WIDTH } from "../EditShorts";

interface SubtitleInputProps {
  subtitle: SubtitleContent;
  templateWidth: number;
  handleChangeSubtitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickPanel(): void;
  handleClickWorkMenu(workMenu: WorkMenu): void;
  handleClickSubtitleInput(): void;
}

export default function SubtitleInput({
  subtitle,
  templateWidth,
  handleChangeSubtitle,
  handleClickPanel,
  handleClickWorkMenu,
  handleClickSubtitleInput,
}: SubtitleInputProps) {
  const { text, x1, y1, x2, y2, font, size, color, background, textOpacity, bgOpacity } = subtitle;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleClickPanel();
        handleClickWorkMenu("subtitle");
        handleClickSubtitleInput();
      }}
      style={{
        left: `${x1 * 100}%`,
        right: `${100 - x2 * 100}%`,
        top: `${y1 * 100}%`,
        bottom: `${100 - y2 * 100}%`,
        background: hexToRgba(background, bgOpacity),
      }}
      className={`flex absolute z-40 justify-center`}
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
        onChange={handleChangeSubtitle}
        className={`
        z-50 focus:outline-none text-center h-fit
        `}
      />
    </div>
  );
}