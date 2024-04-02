'use client';

// react
import { useEffect, useState } from 'react';

// nextjs
import { useRouter } from 'next/navigation';

// react icon
import { TiThMenu } from 'react-icons/ti';
import { TbTransferIn } from 'react-icons/tb';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { RiAiGenerate } from 'react-icons/ri';

import ShortformPlayer from '@/components/shortform/ShortformPlayer';

type ShortformContentsProps = {
  assetId: number;
  shortform: ShortFormTask;
  list: ShortFormTask[];
  extraTypes: ShortFormExtraType[];
};

export default function ShortformContents(props: ShortformContentsProps) {
  // props
  const { assetId, shortform, list, extraTypes } = props;

  // router
  const router = useRouter();

  // state
  const [nowSrc, setNowSrc] = useState<string>(``);
  const [prev, setPrev] = useState<ShortFormTask | false>(false);
  const [now, setNow] = useState<ShortFormTask>();
  const [next, setNext] = useState<ShortFormTask | false>(false);
  const [showExtra, setShowExtra] = useState<boolean>(false);

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

  return (
    <div className="flex justify-center items-end size-full gap-1 relative h-full">
      {/* title */}
      <div className="absolute bottom-0 left-0 invisible xl:visible xl:w-64 2xl:w-96">
        <h2 className="text-2xl font-bold">{shortform.title}</h2>
        <h3 className="mt-2 text-lg text-gray-500">{shortform.asset.title}</h3>
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
          {/* download */}
          <div className="tooltip w-full" data-tip="다운로드">
            <a
              className="btn btn-circle btn-neutral hover:scale-110"
              href={`${nowSrc}/download`}
              download
            >
              <FiDownload className="w-6 h-6" />
            </a>
          </div>

          {/* menu */}
          <div className="tooltip w-full" data-tip="메뉴">
            <button
              className="btn btn-circle btn-neutral hover:scale-110"
              type="button"
              onMouseEnter={() => setShowExtra(true)}
              onMouseLeave={() => setShowExtra(false)}
            >
              <TiThMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* extra */}
      <div className="flex-none w-56 h-full rounded-xl shadow-2xl px-3 py-2">
        <div className="flex flex-col size-full justify-start items-start gap-2 overflow-auto">
          <div className="flex w-full justify-center items-center mb-2">
            <span className="mr-2">
              <TbTransferIn className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-bold">입수 영상 목록</h2>
          </div>
          {extraTypes.map((item) => (
            <div
              key={`extra-type-row-${item.id}`}
              className="flex flex-col gap-3 w-full px-4 py-2 rounded-2xl bg-gray-100"
            >
              <h2 className="text-lg font-bold">{item.name}</h2>
              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <div className="tooltip" data-tip="다운로드">
                    <a
                      className={`btn btn-circle btn-neutral ${
                        shortform.taskExtras?.find(
                          (taskExtra) => taskExtra.extraType.id === item.id,
                        )?.status !== 'SUCCESS' && 'btn-disabled'
                      }`}
                      type="button"
                      href={`/api/v1/shorts/task/extra/${
                        shortform.taskExtras?.find(
                          (taskExtra) => taskExtra.extraType.id === item.id,
                        )?.id
                      }/resource/download`}
                    >
                      <FiDownload className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="tooltip" data-tip="생성 요청">
                    <button
                      className="btn btn-circle btn-neutral"
                      type="button"
                      disabled={
                        !!shortform.taskExtras?.find(
                          (taskExtra) => taskExtra.extraType.id === item.id,
                        )
                      }
                    >
                      <FiUpload className="w-5 h-5" />
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
          <div>
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

          {/* prev button */}
          <div>
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
  );
}
