import { generateTimeArray } from "./util";

interface TimeLineProps {
  unitWidth: number;
}

const TIME_ARRAY_START_SECONDS = 0;
const TIME_ARRAY_END_SECONDS = 5400;
const TIME_ARRAY_STEP_SECONDS = 300;

export default function TimeLine({ unitWidth }: TimeLineProps) {
  const timeArray = generateTimeArray(TIME_ARRAY_START_SECONDS, TIME_ARRAY_END_SECONDS, TIME_ARRAY_STEP_SECONDS);

  return (
    <div
      style={{ gridTemplateColumns: `repeat(${timeArray.length},${unitWidth * 5}px)` }}
      className="relative grid bg-slate-200"
    >
      {timeArray.map((v, i) => (
        <div
          key={i}
          style={{ gridTemplateColumns: `repeat(5,${unitWidth}px)` }}
          className="grid border-l border-slate-700"
        >
          <div className="border-r h-2 mb-1 border-slate-700"></div>
          <div className="border-r h-2 border-slate-700"></div>
          <div className="border-r h-2 border-slate-700"></div>
          <div className="border-r h-2 border-slate-700"></div>
          <div></div>

          <span className="pl-2 text-xs select-none">{v}</span>
        </div>
      ))}
      {/* <span className="text-xs absolute right-0 top-4 select-none">{secondsToHhmmss(videoDuration)}</span> */}
    </div>
  );
}
