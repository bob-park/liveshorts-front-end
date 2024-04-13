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

import ShortFormList from '@/components/shortform/ShortFormList';
import CopyShortFormConfirm from './CopyShortFormConfirm';
import RemoveShortFormConfirm from './RemoveShortFormConfirm';
import CreateShortFormModal from './CreateShortFormModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addTask,
  copyTask,
  getTasksByAssetId,
  removeTask,
  updateTask,
} from '@/entries/shortform/api/requestShortformTask';

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

  // state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const [showCopyConfirm, setShowCopyConfirm] = useState<boolean>(false);
  const [copyTaskId, setCopyTaskId] = useState<string>();

  const [showRemoveConfirm, setShowRemoveConfirm] = useState<boolean>(false);
  const [removeTaskId, setRemoveTaskId] = useState<string>();

  // query client
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery<ShortFormTask[]>({
    queryKey: ['shortforms', assetId],
    queryFn: () => getTasksByAssetId(assetId),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
    refetchInterval: 10 * 1_000,
  });

  const { mutate: onGetTasks, isPending } = useMutation({
    mutationKey: ['shortforms'],
    mutationFn: () => getTasksByAssetId(assetId),
    onMutate: () => {},
    onSuccess: (data) => {
      queryClient.setQueryData(['shortforms'], data);
    },
  });

  const { mutate: onAddTask } = useMutation({
    mutationKey: ['shortforms', 'add'],
    mutationFn: (title: string) => addTask(assetId, title),
    onSuccess: (data) => {
      router.push(`/edit/${assetId}/shortform/${data.id}`);
    },
  });

  const { mutate: onRemoveTask } = useMutation({
    mutationKey: ['shortforms', 'remove'],
    mutationFn: (taskId: string) => removeTask(taskId),
    onSuccess: () => {
      const prev = tasks?.slice() || [];
      const index = prev.findIndex((item) => item.id === removeTaskId);
      index >= 0 && prev.splice(index, 1);

      queryClient.setQueryData(['shortforms', assetId], prev);
    },
  });

  const { mutate: onUpdateTask } = useMutation({
    mutationKey: ['shortforms', 'update'],
    mutationFn: ({ taskId, title }: { taskId: string; title: string }) =>
      updateTask(taskId, { title }),
    onSuccess: (data) => {
      const newTask = tasks?.slice() || [];
      const index = newTask.findIndex((item) => item.id === data.id);

      index >= 0 && newTask.splice(index, 1, data);

      queryClient.setQueryData(['shortforms', assetId], newTask);
    },
  });

  const { mutate: onCopyTask } = useMutation({
    mutationKey: ['shortforms', 'copy'],
    mutationFn: (taskId: string) => copyTask(taskId),
    onSuccess: (data) => {
      const newTask = tasks?.slice() || [];
      newTask.unshift(data);
      queryClient.setQueryData(['shortforms', assetId], newTask);

      onUpdateTask({ taskId: data.id, title: data.title + ' - 복사본' });
    },
  });

  //useEffect
  useLayoutEffect(() => {
    handleGetShortFormTask();
  }, []);

  // handle
  const handleGetShortFormTask = () => {
    onGetTasks();
  };

  const handleMoveShortformView = (taskId: string) => {
    const task = tasks?.find((item) => item.id === taskId);

    if (!task || task.status !== 'SUCCESS') {
      return;
    }

    router.push(`/asset/${assetId}/shortform/${taskId}`);
  };

  const handleCreateShortForm = (title: string | undefined) => {
    title && onAddTask(title);
  };

  const handleEditShortForm = (taskId: string) => {
    router.push(`/edit/${assetId}/shortform/${taskId}`);
  };

  const handleCopyShortForm = () => {
    copyTaskId && onCopyTask(copyTaskId);
  };

  const handleRemoveShortForm = () => {
    removeTaskId && onRemoveTask(removeTaskId);
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
                onClick={() => setShowCreateModal(true)}
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
          {isPending && <ShortFormLoading />}
          {!isPending && tasks?.length === 0 && <EmptyShortFormList />}
          {!isPending && tasks && (
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

      {/* create shortform modal */}
      <CreateShortFormModal
        show={showCreateModal}
        onBackdrop={() => setShowCreateModal(false)}
        onCreate={handleCreateShortForm}
      />

      {/* copy confirm modal */}
      <CopyShortFormConfirm
        show={showCopyConfirm}
        shortform={tasks?.find((item) => item.id === copyTaskId)}
        onBackdrop={() => setShowCopyConfirm(false)}
        onConfirm={handleCopyShortForm}
      />

      {/* remove confirm modal */}
      <RemoveShortFormConfirm
        show={showRemoveConfirm}
        shortform={tasks?.find((item) => item.id === removeTaskId)}
        onBackdrop={() => setShowRemoveConfirm(false)}
        onConfirm={handleRemoveShortForm}
      />
    </>
  );
}
