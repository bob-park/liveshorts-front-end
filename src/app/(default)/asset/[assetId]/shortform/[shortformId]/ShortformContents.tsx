'use client';

// react icon
import { TiThMenu } from 'react-icons/ti';

import ShortformPlayer from '@/components/shortform/ShortformPlayer';

type ShortformContentsProps = {
  shortform: ShortFormTask;
};

export default function ShortformContents(props: ShortformContentsProps) {
  // props
  const { shortform } = props;

  return (
    <div className="flex justify-center items-end size-full gap-4 relative">
      {/* title */}
      <div className="absolute bottom-0 left-0 invisible xl:visible xl:w-64 2xl:w-96">
        <h2 className="text-2xl font-bold">{shortform.title}</h2>
      </div>

      {/* shortform player */}
      <div className="max-w-[608px] h-full max-h-[1080px] aspect-[9/16]">
        <div className=" "></div>
        <ShortformPlayer
          src={`/api/v1/shorts/task/${
            shortform.id
          }/resource?t=${new Date().getTime()}`}
        />
      </div>
      <div className="w-16">
        <div className="flex justify-center items-end">
          <div className="tooltip" data-tip="메뉴">
            <button className="btn btn-circle" type="button">
              <TiThMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
