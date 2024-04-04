// react
import { useEffect } from 'react';

// react icon
import { LuCopyPlus } from 'react-icons/lu';
import { IoCloseCircleOutline } from 'react-icons/io5';

type CopyShortFormConfirmProps = {
  show: boolean;
  shortform?: ShortFormTask;
  onBackdrop?: () => void;
  onConfirm?: () => void;
};

const id = 'copy_shortform_confirm_modal';

export default function CopyShortFormConfirm({
  show,
  shortform,
  onBackdrop,
  onConfirm,
}: CopyShortFormConfirmProps) {
  // state

  // useEffect
  useEffect(() => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (!modal) {
      return;
    }

    show ? modal.showModal() : modal.close();
  }, [show]);

  // handle
  const handleBackdrop = () => {
    onBackdrop && onBackdrop();
  };

  const handleKeyboardDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      handleBackdrop();
    }
  };

  const handleConfirm = () => {
    onConfirm && onConfirm();
  };

  return (
    <dialog
      id={id}
      className="modal modal-bottom sm:modal-middle"
      onKeyDownCapture={handleKeyboardDown}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">숏폼 복사</h3>
        <p className="py-4">
          "<strong className="text-lg">{shortform?.title}</strong>" 을(를)
          복사하시겠습니까?
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button type="button" className="btn" onClick={handleBackdrop}>
              <IoCloseCircleOutline className="w-6 h-6" />
              취소
            </button>

            <button
              type="button"
              className="btn btn-neutral ml-3"
              onClick={handleConfirm}
            >
              <LuCopyPlus className="w-6 h-6" />
              복사
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
