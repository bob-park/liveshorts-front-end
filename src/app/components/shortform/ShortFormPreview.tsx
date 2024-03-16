import { useLayoutEffect } from 'react';
import AssetPlayer from '../asset/AssetPlayer';

type ShortFormViewProps = {
  show: boolean;
  task?: ShortFormTask;
  onBackdrop?: () => void;
};

export default function ShortFormPreview(props: ShortFormViewProps) {
  // props
  const { show, task, onBackdrop } = props;

  // state

  // useLayoutEffect
  useLayoutEffect(() => {
    const modal = document.getElementById(
      'short_form_preview_modal',
    ) as HTMLDialogElement;

    show && modal.showModal();
  }, [show]);

  // handle
  const handleBackdrop = () => {
    onBackdrop && onBackdrop();
  };

  return (
    <dialog
      id="short_form_preview_modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box w-screen h-screen">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleBackdrop}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">숏폼 미리보기</h3>
        <div className="grid grid-cols-3 gap-3 w-full h-full justify-center items-center">
          <div className="col-span-3">
            {task && (
              <video
                src={`/api/v1/shorts/task/${
                  task.id
                }/resource?t=${new Date().getTime()}`}
                controls
              />
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
