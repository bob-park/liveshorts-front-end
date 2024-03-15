import ShortFormListItem from './ShortFormListItem';

type ShortFormListProps = {
  tasks: ShortFormTask[];
};

export default function ShortFormList(props: ShortFormListProps) {
  const { tasks } = props;

  return (
    <div className="grid grid-cols-1 gap-3">
      {tasks.map((task) => (
        <div className="col-span-1" key={`short-form-task-${task.id}`}>
          <ShortFormListItem task={task} />
        </div>
      ))}
    </div>
  );
}
