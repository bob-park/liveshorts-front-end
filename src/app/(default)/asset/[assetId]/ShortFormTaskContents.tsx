'use client';

// react
import { useLayoutEffect, useState, useEffect } from 'react';

// nextjs
import { useRouter } from 'next/navigation';

// react icons
import { SiYoutubeshorts } from 'react-icons/si';
import { CgPlayListRemove } from 'react-icons/cg';
import { IoAddCircleSharp } from 'react-icons/io5';
import { TbReload } from 'react-icons/tb';

// hooks
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

import { shortFormActions } from '@/store/shortform';
import ShortFormList from '@/components/shortform/ShortFormList';
import CopyShortFormConfirm from './CopyShortFormConfirm';
import RemoveShortFormConfirm from './RemoveShortFormConfirm';

// action
const {
  requestSearchShortFormTask,
  requestCreateShortForm,
  requestUpdateShortForm,
  requestCopyShortForm,
  requestRemoveShortForm,
} = shortFormActions;

const ShortFormLoading = () => {
  return (
    <div className="flex justify-center items-center w-full h-40">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
};

const EmptyShortFormList = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-40">
      <div className="">
        <CgPlayListRemove className="w-24 h-24 text-gray-500" />
      </div>
      <div className="mt-2 text-md font-bold">
        <h3>숏폼 영상이 없습니다.</h3>
      </div>
    </div>
  );
};

export default function ShortFormTaskContents(props: { assetId: number }) {
  // props
  const { assetId } = props;

  // router
  const router = useRouter();

  // store
  const dispatch = useAppDispatch();
  const { isLoading, tasks, copiedTaskId } = useAppSelector(
    (state) => state.shortForm,
  );

  // state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createTitle, setCreateTitle] = useState<string>();

  const [showCopyConfirm, setShowCopyConfirm] = useState<boolean>(false);
  const [copyTaskId, setCopyTaskId] = useState<string>();

  const [showRemoveConfirm, setShowRemoveConfirm] = useState<boolean>(false);
  const [removeTaskId, setRemoveTaskId] = useState<string>();

  //useEffect
  useLayoutEffect(() => {
    handleGetShortFormTask();
  }, []);

  useEffect(() => {
    if (!copiedTaskId || !copyTaskId) {
      return;
    }

    const shortform = tasks.find((item) => item.id === copyTaskId);

    if (!shortform) {
      return;
    }

    dispatch(
      requestUpdateShortForm({
        taskId: copiedTaskId,
        title: `${shortform.title} - 복사본`,
      }),
    );
  }, [copiedTaskId, copyTaskId]);

  // handle
  const handleGetShortFormTask = () => {
    dispatch(requestSearchShortFormTask({ assetId }));
  };

  const handleMoveShortformView = (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId);

    if (!task || task.status !== 'SUCCESS') {
      return;
    }

    router.push(`/asset/${assetId}/shortform/${taskId}`);
  };

  const handleCreateShortForm = () => {
    router.push(`/edit/${assetId}`);
  };

  const handleEditShortForm = (taskId: string) => {};

  const handleCopyShortForm = () => {
    copyTaskId && dispatch(requestCopyShortForm({ taskId: copyTaskId }));
  };

  const handleRemoveShortForm = () => {
    removeTaskId && dispatch(requestRemoveShortForm({ taskId: removeTaskId }));
  };

  return (
    <>
      <div className="gird grid-cols-1 gap-2 w-full h-full rounded-box shadow-2xl p-5">
        <div className="col-span-1">
          <div className="flex justify-center items-center relative">
            <SiYoutubeshorts className="w-10 h-10 text-red-700" />
            <span className="ml-2 text-lg font-bold">숏폼 영상 목록</span>

            <div className="absolute left-0">
              <button
                className="btn btn-sm btn-neutral transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-blue-950 duration-300"
                type="button"
                onClick={handleCreateShortForm}
              >
                <IoAddCircleSharp className="w-6 h-6" />
                숏폼 생성
              </button>
            </div>
            <div className="absolute right-2">
              <div className="tooltip w-full" data-tip="새로고침">
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={handleGetShortFormTask}
                >
                  <TbReload className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 mt-4">
          {isLoading && <ShortFormLoading />}
          {!isLoading && tasks.length === 0 && <EmptyShortFormList />}
          {!isLoading && tasks && (
            <ShortFormList
              tasks={tasks}
              onRowClick={handleMoveShortformView}
              onRowEdit={handleEditShortForm}
              onRowCopy={(taskId) => {
                setShowCopyConfirm(true);
                setCopyTaskId(taskId);
              }}
              onRowRemove={(taskId) => {
                setShowRemoveConfirm(true);
                setRemoveTaskId(taskId);
              }}
            />
          )}
        </div>
      </div>

      {/* copy confirm modal */}
      <CopyShortFormConfirm
        show={showCopyConfirm}
        shortform={tasks.find((item) => item.id === copyTaskId)}
        onBackdrop={() => setShowCopyConfirm(false)}
        onConfirm={handleCopyShortForm}
      />

      {/* remove confirm modal */}
      <RemoveShortFormConfirm
        show={showRemoveConfirm}
        shortform={tasks.find((item) => item.id === removeTaskId)}
        onBackdrop={() => setShowRemoveConfirm(false)}
        onConfirm={handleRemoveShortForm}
      />
    </>
  );
}
