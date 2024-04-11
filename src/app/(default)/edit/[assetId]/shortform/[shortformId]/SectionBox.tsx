import { ActivePanel } from "./type";

interface SectionBoxProps {
  sectionBoxRef: React.RefObject<HTMLDivElement>;
  startX: number;
  endX: number;
  activePanel: ActivePanel | null;
  handleMouseDownSectionBox: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseDownStartExpand: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseDownEndExpand: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleClickPanel: () => void;
}

export default function SectionBox({
  sectionBoxRef,
  startX,
  endX,
  activePanel,
  handleMouseDownSectionBox,
  handleMouseDownStartExpand,
  handleMouseDownEndExpand,
  handleClickPanel,
}: SectionBoxProps) {
  return (
    <div
      ref={sectionBoxRef}
      style={{
        width: `${endX - startX}px`,
        left: `${startX}px`,
      }}
      onMouseDown={handleMouseDownSectionBox}
      onClick={handleClickPanel}
      className={`
        absolute top-0 flex justify-between h-full
        cursor-grab rounded-lg
        group
        bg-slate-200
                `}
    >
      <div
        onMouseDown={handleMouseDownStartExpand}
        className={`
          cursor-w-resize
          rounded-l-lg w-[24px] min-w-[24px]
          border-t-4 border-b-4 border-l-4
          ${activePanel !== "video" && "group-hover:border-opacity-60"}
          ${activePanel === "video" ? " border-opacity-100" : "border-opacity-20"}
          border-slate-700
                `}
      ></div>
      <div
        className={`
            w-full
            inset-0 border-t-4 border-b-4 box-content
            ${activePanel !== "video" && "group-hover:border-opacity-60"}
            ${activePanel === "video" ? " border-opacity-100" : "border-opacity-20"}
          border-slate-700
                `}
      ></div>
      <div
        onMouseDown={handleMouseDownEndExpand}
        className={`
                cursor-e-resize
                rounded-r-lg w-[24px] min-w-[24px]
                border-t-4 border-b-4 border-r-4
                ${activePanel !== "video" && "group-hover:border-opacity-60"}
                ${activePanel === "video" ? " border-opacity-100" : "border-opacity-20"}
                border-slate-700
                `}
      ></div>
    </div>
  );
}
