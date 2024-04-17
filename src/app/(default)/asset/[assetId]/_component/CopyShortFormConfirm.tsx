// react
import { useEffect } from 'react';

// react icon
import { LuCopyPlus } from 'react-icons/lu';
import { IoCloseCircleOutline } from 'react-icons/io5';
import useCopyShortform from '@/hooks/shortform/useCopyShortform';
import useSearchTask from '@/hooks/shortform/useSearchTask';

type CopyShortFormConfirmProps = {
  show: boolean;
  assetId: number;
  shortform?: ShortFormTask;
  onBackdrop?: () => void;
  onSuccess?: (taskId: string, title: string) => void;
};

const id = 'copy_shortform_confirm_modal';

export default function CopyShortFormConfirm({
  show,
  assetId,
  shortform,
  onBackdrop,
  onSuccess,
}: CopyShortFormConfirmProps) {
  // state

  const { tasks } = useSearchTask(assetId);
  const { onCopyShortform, isLoading } = useCopyShortform(
    tasks,
    assetId,
    (newShortForm) => {
      onSuccess && onSuccess(newShortForm.id, newShortForm.title + ' - 복사본');
      handleBackdrop();
    },
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

  const handleConfirm = () => {
    shortform && onCopyShortform(shortform.id);
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
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner" />
              ) : (
                <LuCopyPlus className="w-6 h-6" />
              )}
              복사
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
