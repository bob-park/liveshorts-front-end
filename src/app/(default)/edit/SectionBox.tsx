import { LineType } from "./EditShorts";

interface SectionBoxProps {
  sectionBoxRef: React.RefObject<HTMLDivElement>;
  startX: number;
  endX: number;
  selectedLine: LineType | null;
  handleMouseDownSectionBox: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseDownStartExpand: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseDownEndExpand: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleClickLine: () => void;
}

export default function SectionBox({
  sectionBoxRef,
  startX,
  endX,
  selectedLine,
  handleMouseDownSectionBox,
  handleMouseDownStartExpand,
  handleMouseDownEndExpand,
  handleClickLine,
}: SectionBoxProps) {
  return (
    <div
      ref={sectionBoxRef}
      style={{
        width: `${endX - startX}px`,
        left: `${startX}px`,
      }}
      onMouseDown={handleMouseDownSectionBox}
      onClick={handleClickLine}
      className={`
        absolute top-0 flex justify-between h-full
        cursor-grab rounded-lg
        group
        bg-slate-200
                `}
    >
      <div
        onMouseDown={handleMouseDownStartExpand}
        // style={{ width: `${(progressRef.current?.clientWidth ?? 0) / 50}px` }}
        className={`
          cursor-w-resize
          rounded-l-lg w-[24px] min-w-[24px]
          ${selectedLine !== "video" && "group-hover:opacity-50"}
          ${selectedLine === "video" ? " opacity-100" : "opacity-0"}
          bg-slate-600
                `}
      ></div>
      <div
        className={`
            w-full
            inset-0 border-t-4 border-b-4 box-content border-opacity-0
            ${selectedLine !== "video" && "group-hover:border-opacity-50"}
            ${selectedLine === "video" ? " border-opacity-100" : "border-opacity-0"}
          border-slate-600
                `}
      ></div>
      <div
        onMouseDown={handleMouseDownEndExpand}
        className={`
                cursor-e-resize
                rounded-r-lg w-[24px] min-w-[24px]
                ${selectedLine !== "video" && "group-hover:opacity-50"}
                ${selectedLine === "video" ? " opacity-100" : "opacity-0"}
                bg-slate-600
                `}
      ></div>
    </div>
  );
}
