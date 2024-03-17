type ScheduleListProps = {
  schedules: RecordSchedule[];
};

const ScheduleListItem = () => {
  return <div>item</div>;
};

export default function ScheduleList(props: ScheduleListProps) {
  // props
  const { schedules } = props;

  return (
    <div>
      <div>schedules</div>
    </div>
  );
}
