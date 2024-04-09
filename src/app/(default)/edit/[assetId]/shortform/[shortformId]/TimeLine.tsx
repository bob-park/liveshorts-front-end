import { secondsToHhmmss } from "./util";

interface TimeLineProps {
  timeLineIntervalCount: number;
  timeArray: string[];
  videoDuration: number;
  progressWidthPercent: number;
  unitWidth: number;
}

export default function TimeLine({
  timeLineIntervalCount,
  videoDuration,
  progressWidthPercent,
  unitWidth,
}: TimeLineProps) {
  const timeArray = [
    "00:00:00",
    "00:05:00",
    "00:10:00",
    "00:15:00",
    "00:20:00",
    "00:25:00",
    "00:30:00",
    "00:35:00",
    "00:40:00",
    "00:45:00",
    "00:50:00",
    "00:55:00",
    "01:00:00",
    "01:05:00",
    "01:10:00",
    "01:15:00",
    "01:20:00",
    "01:25:00",
    "01:30:00",
  ];

  return (
    <div
      style={{ gridTemplateColumns: `repeat(${timeArray.length},${unitWidth * 5}px)` }}
      // style={{ gridTemplateColumns: `repeat(${timeLineIntervalCount - 1},500px)` }}
      className="relative grid bg-slate-200"
    >
      {timeArray.map((v, i) => (
        <div
          key={i}
          // style={{ gridTemplateColumns: `repeat(5,calc(${progressWidthPercent / 100}*${MINIMUM_UNIT_WIDTH}px))` }}
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
