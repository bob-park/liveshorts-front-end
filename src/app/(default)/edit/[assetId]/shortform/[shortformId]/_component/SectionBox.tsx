import { LineType } from "./type";

interface SectionBoxProps {
  sectionBoxRef?: React.RefObject<HTMLDivElement>;
  startX: number;
  endX: number;
  lineType: LineType | null;
  isActive: boolean;
  text?: string;
  isSelected?: boolean;
  handleMouseDownSectionBox: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseDownStartExpand: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseDownEndExpand: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface SectionBoxPartProps {
  part: "left" | "middle" | "right";
  isError: boolean;
  isActive: boolean;
  lineType: LineType | null;
  text?: string;
  isSelected?: boolean;
  handleMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function SectionBox({
  sectionBoxRef,
  startX,
  endX,
  lineType,
  isActive,
  text,
  isSelected,
  handleMouseDownSectionBox,
  handleMouseDownStartExpand,
  handleMouseDownEndExpand,
}: SectionBoxProps) {
  const width = startX > endX ? 0 : endX - startX;
  const isError = startX > endX;

  return (
    <div
      ref={sectionBoxRef}
      style={{
        width: `${width}px`,
        left: `${startX}px`,
      }}
      onMouseDown={handleMouseDownSectionBox}
      className={`
        absolute top-0 flex justify-between h-full
        cursor-grab
        group
                `}
    >
      <SectionBoxPart
        part="left"
        isError={isError}
        isActive={isActive}
        lineType={lineType}
        isSelected={isSelected}
        handleMouseDown={handleMouseDownStartExpand}
      />
      <SectionBoxPart
        part="middle"
        isError={isError}
        isActive={isActive}
        lineType={lineType}
        text={text}
        isSelected={isSelected}
      />
      <SectionBoxPart
        part="right"
        isError={isError}
        isActive={isActive}
        lineType={lineType}
        isSelected={isSelected}
        handleMouseDown={handleMouseDownEndExpand}
      />
    </div>
  );
}

function SectionBoxPart({ part, isError, isActive, lineType, text, isSelected, handleMouseDown }: SectionBoxPartProps) {
  return (
    <div
      onMouseDown={handleMouseDown}
      className={`
   w-[0px] min-w-[12px] border-t-4 border-b-4 truncate
  ${part === "left" && "cursor-w-resize rounded-l-md border-l-4"}
  ${part === "right" && "cursor-e-resize rounded-r-md border-r-4"}
  ${part === "middle" && "w-full inset-0 box-content"}
  ${isError && "border-red-700"}
  ${!isActive && "group-hover:border-opacity-60"}
  ${isActive ? " border-opacity-100" : "border-opacity-20"}
  ${lineType === "video" && "border-slate-700 bg-slate-100"}
  ${lineType === "title" && "border-violet-700 bg-violet-100"}
  ${lineType === "subtitle" && isSelected && "border-cyan-700 bg-cyan-100"}
  ${lineType === "bgm" && "border-pink-700 bg-pink-100"}
        `}
    >
      <span className="text-sm select-none">{text}</span>
    </div>
  );
}
