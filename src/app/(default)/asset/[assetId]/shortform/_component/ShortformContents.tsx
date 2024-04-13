'use client';

// react
import { useEffect, useState } from 'react';

// nextjs
import { useRouter } from 'next/navigation';

// react icon
import { TiThMenu } from 'react-icons/ti';
import { TbTransferIn, TbReload } from 'react-icons/tb';
import { TbDownloadOff, TbDownload, TbUpload } from 'react-icons/tb';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { SiYoutubeshorts } from 'react-icons/si';

import ShortformPlayer from '@/components/shortform/ShortformPlayer';

import { shortFormActions } from '@/store/shortform';
import CreateShortformExtraModal from './CreateShortformExtraModal';
import { parseStatus } from '@/utils/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getTask } from '@/entries/shortform/api/requestShortformTask';
import { requestExtra } from '@/entries/shortform/api/requestShortformExtra';

type ShortformContentsProps = {
  assetId: number;
  shortform: ShortFormTask;
  list: ShortFormTask[];
  extraTypes: ShortFormExtraType[];
};

const ShortFormExtraLoading = () => {
  return (
    <div className="flex justify-center items-center w-full h-40">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
};

export default function ShortformContents(props: ShortformContentsProps) {
  // props
  const { assetId, shortform, list, extraTypes } = props;

  // router
  const router = useRouter();

  // react query
  const {
    data: storeShortForm,
    isPending: isLoading,
    refetch: onGetShortform,
  } = useQuery<ShortFormTask>({
    queryKey: ['shortforms', 'detail', shortform.id],
    queryFn: () => getTask(shortform.id),
    staleTime: 60 * 1_000,
    gcTime: 120 & 1_000,
    refetchInterval: 10 * 1_000,
  });

  const { mutate: onRequestExtra } = useMutation({
    mutationKey: ['shortforms', 'request', shortform.id, 'extra'],
    mutationFn: (typeId: string) => requestExtra(shortform.id, typeId),
  });

  // state
  const [nowSrc, setNowSrc] = useState<string>(``);
  const [prev, setPrev] = useState<ShortFormTask | false>(false);
  const [now, setNow] = useState<ShortFormTask>();
  const [next, setNext] = useState<ShortFormTask | false>(false);
  const [showExtra, setShowExtra] = useState<boolean>(false);
  const [showCreateExtra, setShowCreateExtra] = useState<boolean>(false);
  const [selectExtraType, setSelectExtraType] = useState<ShortFormExtraType>();

  // useEffect
  useEffect(() => {
    const now = list.find((item) => item.id === shortform.id);

    setNow(now);
  }, [shortform]);

  useEffect(() => {
    if (!now) {
      return;
    }

    const nowIndex = list.findIndex((item) => item.id === now.id);
    const newPrev = nowIndex > 0 && list[nowIndex - 1];
    const newNext =
      nowIndex >= 0 && nowIndex + 1 < list.length && list[nowIndex + 1];

    setNowSrc(`/api/v1/shorts/task/${now.id}/resource`);
    setPrev(newPrev);
    setNext(newNext);
  }, [now]);

  // handle
  const handlePrev = () => {
    prev && router.replace(`/asset/${assetId}/shortform/${prev.id}`);
  };

  const handleNext = () => {
    next && router.replace(`/asset/${assetId}/shortform/${next.id}`);
  };

  const handleShowCreateExtra = (
    show: boolean,
    extraType?: ShortFormExtraType,
  ) => {
    setShowCreateExtra(show);

    show ? setSelectExtraType(extraType) : setSelectExtraType(undefined);
  };

  const handleCreateExtra = () => {
    if (!selectExtraType) {
      return;
    }

    onRequestExtra(selectExtraType.id);
  };

  return (
    <>
      <div className="flex justify-center items-end size-full gap-1 relative h-full">
        {/* title */}
        <div className="absolute bottom-0 left-0 invisible xl:visible xl:w-48 2xl:w-80">
          <h2 className="text-2xl font-bold">{shortform.title}</h2>
          <h3 className="mt-2 text-lg text-gray-500">
            {shortform.asset.title}
          </h3>
        </div>

        {/* shortform player */}
        <div className="h-full aspect-[9/16]">
          <div className="h-full flex flex-col gap-1 justify-center items-center">
            {/* player */}
            <div className="h-full">
              <ShortformPlayer src={nowSrc} hoverEvent autoPlay />
            </div>
          </div>
        </div>

        {/* menu */}
        <div className="w-16">
          <div className="flex flex-col justify-center items-end gap-3 mb-2">
            {/* YouTube Upload */}
            <div className="tooltip w-full" data-tip="숏폼 업로드">
              <button
                className="btn btn-circle btn-neutral hover:scale-110"
                type="button"
              >
                <SiYoutubeshorts className="w-6 h-6 " />
              </button>
            </div>

            {/* download */}
            <div className="tooltip w-full" data-tip="다운로드">
              <a
                className="btn btn-circle btn-neutral hover:scale-110"
                href={`${nowSrc}/download`}
                download
              >
                <TbDownload className="w-6 h-6" />
              </a>
            </div>

            {/* menu */}
            <div className="tooltip w-full" data-tip="메뉴">
              <button
                className="btn btn-circle btn-neutral hover:scale-110"
                type="button"
                onClick={() => setShowExtra(!showExtra)}
              >
                <TiThMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* extra */}
        <div
          className={`flex-none w-80 h-full ml-4 rounded-xl shadow-2xl px-5 py-2 transition-all duration-150 ${
            showExtra
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-2 hidden'
          } relative`}
        >
          <div className="flex flex-col size-full justify-start items-start gap-2 p-4 overflow-auto">
            <div className="flex w-full justify-center items-center mb-2 ">
              <span className="mr-2">
                <TbTransferIn className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold">입수 영상 목록</h2>

              <div className="absolute right-3 ">
                <div
                  className="tooltip w-full"
                  data-tip="새로고침"
                  onClick={() => now && onGetShortform()}
                >
                  <button className="btn btn-circle btn-ghost" type="button">
                    <TbReload className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            {isLoading && <ShortFormExtraLoading />}
            {!isLoading &&
              extraTypes.map((item) => (
                <div
                  key={`extra-type-row-${item.id}`}
                  className="flex flex-col gap-3 w-full px-4 py-2 rounded-2xl bg-gray-100 transition-all duration-150 hover:scale-105 hover:shadow-xl"
                >
                  <h2 className="text-lg font-bold">{item.name}</h2>
                  <div className="mt-2">
                    <div className="flex justify-between items-center">
                      {storeShortForm?.taskExtras?.find(
                        (taskExtra) => taskExtra.extraType.id === item.id,
                      )?.status === 'SUCCESS' && (
                        <div className="tooltip" data-tip="다운로드">
                          <a
                            className={`btn btn-circle btn-neutral ${
                              storeShortForm.taskExtras?.find(
                                (taskExtra) =>
                                  taskExtra.extraType.id === item.id,
                              )?.status !== 'SUCCESS' && 'btn-disabled'
                            }`}
                            type="button"
                            href={`/api/v1/shorts/task/extra/${
                              storeShortForm.taskExtras?.find(
                                (taskExtra) =>
                                  taskExtra.extraType.id === item.id,
                              )?.id
                            }/resource/download`}
                          >
                            <TbDownload className="w-5 h-5" />
                          </a>
                        </div>
                      )}
                      {storeShortForm?.taskExtras?.find(
                        (taskExtra) => taskExtra.extraType.id === item.id,
                      ) ? (
                        storeShortForm.taskExtras.find(
                          (taskExtra) => taskExtra.extraType.id === item.id,
                        )?.status !== 'SUCCESS' && (
                          <div
                            className="tooltip"
                            data-tip={parseStatus(
                              storeShortForm.taskExtras.find(
                                (taskExtra) =>
                                  taskExtra.extraType.id === item.id,
                              )?.status,
                            )}
                          >
                            <button
                              className="btn btn-circle btn-neutral btn-disabled"
                              type="button"
                            >
                              <span className="loading loading-spinner loading-sm"></span>
                            </button>
                          </div>
                        )
                      ) : (
                        <div className="tooltip" data-tip="없음">
                          <button
                            className="btn btn-circle"
                            type="button"
                            disabled
                          >
                            <TbDownloadOff className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      <div className="tooltip" data-tip="생성 요청">
                        <button
                          className="btn btn-circle btn-neutral"
                          type="button"
                          disabled={
                            !!storeShortForm?.taskExtras?.find(
                              (taskExtra) => taskExtra.extraType.id === item.id,
                            )
                          }
                          onClick={() => handleShowCreateExtra(true, item)}
                        >
                          <TbUpload className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* prev next */}
        <div className="absolute top-0 right-5 h-full">
          <div className="grid grid-col-1 h-full justify-center content-between">
            {/* prev button */}
            <div className={`${!prev && 'invisible'}`}>
              {prev && (
                <div className="tooltip" data-tip="이전 숏폼 영상">
                  <button
                    className="btn btn-circle btn-neutral hover:scale-110"
                    type="button"
                    onClick={handlePrev}
                  >
                    <FaArrowUp className="w-8 h-8" />
                  </button>
                </div>
              )}
            </div>

            {/* next button */}
            <div className={`${!next && 'invisible'}`}>
              {next && (
                <div className="tooltip" data-tip="다음 숏폼 영상">
                  <button
                    className="btn btn-circle btn-neutral hover:scale-110"
                    type="button"
                    onClick={handleNext}
                  >
                    <FaArrowDown className="w-8 h-8" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* create extra modal */}
      <CreateShortformExtraModal
        show={showCreateExtra}
        title={selectExtraType?.name}
        onBackdrop={() => handleShowCreateExtra(false, undefined)}
        onCreate={() => handleCreateExtra()}
      />
    </>
  );
}
