import { RiInformationLine } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';

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
    <div className="alert shadow-lg flex-none w-[430px]" role="alert">
      <RiInformationLine className="w-6 h-6 text-sky-500" />
      <div>
        <h3 className="font-bold">{message}</h3>
      </div>
      <button
        className="btn btn-sm btn-circle"
        type="button"
        onClick={handleRemove}
      >
        <IoClose className="w-6 h-6" />
      </button>
    </div>
  );
}
