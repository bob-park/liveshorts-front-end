import BroadcastScheduleHeaderContents from './BroadcastScheduleHeaderContents';

export default function BroadcastSchedulePage() {
  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-2">
      {/* header */}
      <div className="col-span-1">
        <BroadcastScheduleHeaderContents />
      </div>
    </div>
  );
}
