import { LineType } from "./type";

interface SectionBoxProps {
  sectionBoxRef: React.RefObject<HTMLDivElement>;
  startX: number;
  endX: number;
  lineType: LineType | null;
  isActive: boolean;
  text?: string;
  handleMouseDownSectionBox: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseDownStartExpand: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseDownEndExpand: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleClickPanel: () => void;
}

export default function SectionBox({
  sectionBoxRef,
  startX,
  endX,
  lineType,
  isActive,
  text,
  handleMouseDownSectionBox,
  handleMouseDownStartExpand,
  handleMouseDownEndExpand,
  handleClickPanel,
}: SectionBoxProps) {
  const width = startX > endX ? 0 : endX - startX;
  return (
    <div
      ref={sectionBoxRef}
      style={{
        width: `${width}px`,
        left: `${startX}px`,
      }}
      onMouseDown={handleMouseDownSectionBox}
      onClick={handleClickPanel}
      className={`
        absolute top-0 flex justify-between h-full
        cursor-grab
        group
                `}
    >
      <div
        onMouseDown={handleMouseDownStartExpand}
        className={`
          cursor-w-resize
          rounded-l-md w-[0px] min-w-[12px]
          border-t-4 border-b-4 border-l-4
          ${!isActive && "group-hover:border-opacity-60"}
          ${isActive ? " border-opacity-100" : "border-opacity-20"}
          ${lineType === "video" && "border-slate-700 bg-slate-50"}
          ${lineType === "title" && "border-violet-700 bg-violet-50"}
          ${lineType === "subtitle" && "border-cyan-700 bg-cyan-50"}
          ${lineType === "bgm" && "border-pink-700 bg-pink-50"}
                `}
      ></div>
      <div
        className={`
          w-full
          inset-0 border-t-4 border-b-4 box-content
          ${!isActive && "group-hover:border-opacity-60"}
          ${isActive ? " border-opacity-100" : "border-opacity-20"}
          ${lineType === "video" && "border-slate-700 bg-slate-50"}
          ${lineType === "title" && "border-violet-700 bg-violet-50"}
          ${lineType === "subtitle" && "border-cyan-700 bg-cyan-50"}
          ${lineType === "bgm" && "border-pink-700 bg-pink-50"}
                `}
      >
        {text}
      </div>
      <div
        onMouseDown={handleMouseDownEndExpand}
        className={`
          cursor-e-resize
          rounded-r-md w-[0px] min-w-[12px]
          border-t-4 border-b-4 border-r-4
          ${!isActive && "group-hover:border-opacity-60"}
          ${isActive ? " border-opacity-100" : "border-opacity-20"}
          ${lineType === "video" && "border-slate-700 bg-slate-50"}
          ${lineType === "title" && "border-violet-700 bg-violet-50"}
          ${lineType === "subtitle" && "border-cyan-700 bg-cyan-50"}
          ${lineType === "bgm" && "border-pink-700 bg-pink-50"}
          `}
      ></div>
    </div>
  );
}
