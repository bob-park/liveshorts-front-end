'use client';

// react
import useCreateShortform from '@/hooks/shortform/useCreateShortform';
import { useStore } from '@/shared/rootStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// react icon
import { IoAddCircle } from 'react-icons/io5';
import { IoCloseCircleOutline } from 'react-icons/io5';

type CreateShortFormModalProps = {
  show: boolean;
  assetId: number;
  onBackdrop?: () => void;
  onCreate?: (title?: string) => void;
};

const id = 'create_shortform_modal';

export default function CreateShortFormModal({
  show,
  assetId,
  onBackdrop,
}: CreateShortFormModalProps) {
  // router
  const router = useRouter();

  // store
  const addAlert = useStore((state) => state.addAlert);

  // state
  const [title, setTitle] = useState<string>('');

  const { onCreateShortform, isLoading } = useCreateShortform((shortformId) => {
    router.push(`/edit/${assetId}/shortform/${shortformId}`);
    addAlert(`숏폼 "${title}" 이(가) 생성되었습니다.`);
  });

  // useEffect
  useEffect(() => {
    const modal = document.getElementById(id) as HTMLDialogElement;

    if (!modal) {
      return;
    }

    show ? modal.showModal() : modal.close();

    setTitle('');
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
    title && onCreateShortform({ assetId, title });
  };

  return (
    <dialog
      id={id}
      className="modal modal-bottom sm:modal-middle"
      onKeyDownCapture={handleKeyboardDown}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">숏폼 생성</h3>
        <div className="grid grid-cols-4 gap-2 py-4 items-center">
          <div className="col-span-1 text-right">
            <h3 className="text-base font-bold mr-2">숏폼 제목</h3>
          </div>
          <div className="col-span-2">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="숏폼 제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </label>
          </div>
        </div>
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
              생성
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
