import { Button } from 'react-daisyui';

// react icons
import { IoChevronBack } from 'react-icons/io5';

type BackwardButtonProps = {
  title: string;
  onBackward?: () => void;
};

export default function BackwardButton(props: BackwardButtonProps) {
  const { title, onBackward } = props;

  // handle
  const handleBackdrop = () => {
    onBackward && onBackward();
  };

  return (
    <Button className="h-16" type="button" onClick={handleBackdrop}>
      <IoChevronBack className="w-6 h-6" />
      <div className="flex flex-col items-start text-start">
        <span className="text-base-content/50 hidden text-xs font-normal md:block">
          Back
        </span>
        <span className="text-base min-w-16">{title}</span>
      </div>
    </Button>
  );
}
