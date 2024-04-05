import ShortFormListItem from './ShortFormListItem';

type ShortFormListProps = {
  tasks: ShortFormTask[];
  onRowClick?: (taskId: string) => void;
  onRowEdit?: (taskId: string) => void;
  onRowCopy?: (taskId: string) => void;
  onRowRemove?: (taskId: string) => void;
};

export default function ShortFormList(props: ShortFormListProps) {
  const { tasks, onRowClick, onRowEdit, onRowCopy, onRowRemove } = props;

  // handle
  const handleRowClick = (taskId: string) => {
    onRowClick && onRowClick(taskId);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {tasks.map((task) => (
        <div
          className="col-span-1"
          key={`short-form-task-${task.id}`}
          onClick={() => handleRowClick(task.id)}
        >
          <ShortFormListItem
            task={task}
            onEdit={onRowEdit}
            onCopy={onRowCopy}
            onRemove={onRowRemove}
          />
        </div>
      ))}
    </div>
  );
}
