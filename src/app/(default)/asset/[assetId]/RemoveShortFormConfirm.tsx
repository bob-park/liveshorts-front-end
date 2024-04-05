// react
import { useEffect } from 'react';

// react icon
import { FaTrashAlt } from 'react-icons/fa';
import { IoCloseCircleOutline } from 'react-icons/io5';

type RemoveShortFormConfirmProps = {
  show: boolean;
  shortform?: ShortFormTask;
  onBackdrop?: () => void;
  onConfirm?: () => void;
};

const id = 'remove_shortform_confirm_modal';

export default function RemoveShortFormConfirm({
  show,
  shortform,
  onBackdrop,
  onConfirm,
}: RemoveShortFormConfirmProps) {
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

    handleBackdrop();
  };

  return (
    <dialog
      id={id}
      className="modal modal-bottom sm:modal-middle"
      onKeyDownCapture={handleKeyboardDown}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">숏폼 삭제</h3>
        <p className="py-4">
          "<strong className="text-lg">{shortform?.title}</strong>" 을(를)
          삭제하시겠습니까?
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button type="button" className="btn" onClick={handleBackdrop}>
              <IoCloseCircleOutline className="w-6 h-6" />
              취소
            </button>

            <button
              type="button"
              className="btn btn-error bg-red-600 text-white ml-3"
              onClick={handleConfirm}
            >
              <FaTrashAlt className="w-6 h-6" />
              삭제
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
