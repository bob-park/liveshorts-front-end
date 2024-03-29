'use client';

// react icon
import { TiThMenu } from 'react-icons/ti';
import { FiDownload } from 'react-icons/fi';

import ShortformPlayer from '@/components/shortform/ShortformPlayer';

type ShortformContentsProps = {
  prevShortformId: string | false;
  shortform: ShortFormTask;
  nextShortformId: string | false;
};

export default function ShortformContents(props: ShortformContentsProps) {
  // props
  const { shortform, prevShortformId, nextShortformId } = props;

  return (
    <div className="flex justify-center items-end size-full gap-1 relative h-full">
      {/* title */}
      <div className="absolute bottom-0 left-0 invisible xl:visible xl:w-64 2xl:w-96">
        <h2 className="text-2xl font-bold">{shortform.title}</h2>
      </div>

      {/* shortform player */}
      <div className="h-full aspect-[9/16]">
        <div className="h-full flex flex-col gap-1 justify-center items-center">
          {/* prev */}
          <div className="flex-none w-full h-5">
            {prevShortformId && (
              <div className="size-full bg-black rounded-b-2xl"></div>
            )}
          </div>

          {/* player */}
          <div className="h-full">
            <ShortformPlayer
              src={`/api/v1/shorts/task/${
                shortform.id
              }/resource?t=${new Date().getTime()}`}
            />
          </div>

          {/* next */}
          <div className="flex-none w-full h-5">
            {nextShortformId && (
              <div className="size-full bg-black rounded-t-2xl"></div>
            )}
          </div>
        </div>
      </div>
      <div className="w-16">
        <div className="flex flex-col justify-center items-end gap-3 mb-4">
          <div className="tooltip w-full" data-tip="다운로드">
            <a
              className="btn btn-circle btn-neutral hover:scale-110"
              href={`/api/v1/shorts/task/${shortform.id}/resource/download`}
              download
            >
              <FiDownload className="w-6 h-6" />
            </a>
          </div>
          <div className="tooltip w-full" data-tip="메뉴">
            <button className="btn btn-circle hover:scale-110" type="button">
              <TiThMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
