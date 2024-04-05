import { secondsToHhmmss } from "./util";

interface TimeLineProps {
  timeLineIntervalCount: number;
  timeArray: string[];
  videoDuration: number;
}

export default function TimeLine({ timeLineIntervalCount, timeArray, videoDuration }: TimeLineProps) {
  return (
    <div
      style={{ gridTemplateColumns: `repeat(${timeLineIntervalCount - 1},1fr)` }}
      className="relative grid bg-slate-200"
    >
      {timeArray.map((v, i) => (
        <div key={i} className="grid grid-cols-[repeat(5,1fr)] border-l border-slate-700">
          <div className="border-r h-2 mb-1 border-slate-700"></div>
          <div className="border-r h-2 border-slate-700"></div>
          <div className="border-r h-2 border-slate-700"></div>
          <div className="border-r h-2 border-slate-700"></div>
          <div></div>

          <span className="pl-2 text-xs select-none">{v}</span>
        </div>
      ))}
      <span className="text-xs absolute right-0 top-4 select-none">{secondsToHhmmss(videoDuration)}</span>
    </div>
  );
}
