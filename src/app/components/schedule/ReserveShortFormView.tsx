// react
import { useState, useLayoutEffect } from 'react';

type ReservShortFormViewProps = {
  show: boolean;
  schedule?: RecordSchedule;
  onBackdrop?: () => void;
};

export default function ReservShortFormView(props: ReservShortFormViewProps) {
  // props;
  const { show, schedule, onBackdrop } = props;

  // state

  // useLayoutEffect
  useLayoutEffect(() => {
    const modal = document.getElementById(
      'reserve_short_form_modal',
    ) as HTMLDialogElement;

    show && modal.showModal();
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

  return (
    <dialog
      id="reserve_short_form_modal"
      className="modal modal-bottom sm:modal-middle"
      onKeyDownCapture={handleKeyboardDown}
    >
      <div className="modal-box min-h-[920px]">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleBackdrop}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">숏폼 예약하기</h3>
        <div>reserve short form</div>
      </div>
    </dialog>
  );
}
