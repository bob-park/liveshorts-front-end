import { ReactElement } from "react";
import { IconType } from "react-icons";

interface IconButtonProps {
  toolTip: string;
  Icon: ReactElement;
  onClick: () => void;
}

export default function IconButton({ toolTip, Icon, onClick }: IconButtonProps) {
  return (
    <div className="tooltip" data-tip={toolTip}>
      <button
        type="button"
        onClick={onClick}
        className={`
        focus:outline-0
        w-10 h-10 rounded-full flex justify-center items-center
         bg-neutral-200
       bg-opacity-40 hover:bg-opacity-100
      `}
      >
        <div className="w-5 h-5 flex justify-center items-center text-slate-700">{Icon}</div>
      </button>
    </div>
  );
}
