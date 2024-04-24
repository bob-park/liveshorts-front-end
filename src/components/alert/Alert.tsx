import { RiInformationLine } from 'react-icons/ri';

type AlertProps = {
  message: string;
  onRemove?: () => void;
};

export default function Alert({ message, onRemove }: AlertProps) {
  // handle
  const handleRemove = () => {
    onRemove && onRemove();
  };

  return (
    <div className="alert shadow-lg flex-none w-96" role="alert">
      <RiInformationLine className="w-6 h-6 text-sky-500" />
      <div>
        <h3 className="font-bold">{message}</h3>
      </div>
      <button className="btn btn-sm" type="button" onClick={handleRemove}>
        See
      </button>
    </div>
  );
}
