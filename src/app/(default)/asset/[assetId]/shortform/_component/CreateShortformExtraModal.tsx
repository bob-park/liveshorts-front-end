// react
import useRequestExtra from '@/hooks/shortform/useRequestExtra';
import { useEffect } from 'react';

// react icon
import { IoAddCircle } from 'react-icons/io5';
import { IoCloseCircleOutline } from 'react-icons/io5';

type CreateShortformExtraModalProps = {
  show: boolean;
  shortformId: string;
  selectExtraType?: ShortFormExtraType;
  title?: string;
  onBackdrop?: () => void;
};

const id = 'create_shortform_extra_modal';

export default function CreateShortformExtraModal({
  show,
  shortformId,
  selectExtraType,
  title,
  onBackdrop,
}: CreateShortformExtraModalProps) {
  const { onRequestExtra, isLoading } = useRequestExtra(shortformId, () =>
    handleBackdrop(),
  );

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

  const handleCreate = () => {
    selectExtraType && onRequestExtra(selectExtraType.id);
  };

  return (
    <dialog
      id={id}
      className="modal modal-bottom sm:modal-middle"
      onKeyDownCapture={handleKeyboardDown}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">입수 영상 제작 요청</h3>
        <p className="py-4">
          "<strong>{title}</strong>" 제작 요청하시겠습니까?
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button type="button" className="btn" onClick={handleBackdrop}>
              <IoCloseCircleOutline className="w-6 h-6" />
              취소
            </button>

            <button
              type="button"
              className="btn btn-neutral text-white ml-3"
              onClick={handleCreate}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner" />
              ) : (
                <IoAddCircle className="w-6 h-6" />
              )}
              제작 요청
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
