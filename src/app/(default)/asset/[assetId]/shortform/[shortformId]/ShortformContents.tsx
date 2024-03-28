'use client';

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
      <div className="h-full">
        <div className=" "></div>
        <ShortformPlayer
          src={`/api/v1/shorts/task/${
            shortform.id
          }/resource?t=${new Date().getTime()}`}
        />
      </div>
      <div className=""></div>
    </div>
  );
}
