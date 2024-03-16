import { useState } from 'react';

import Image from 'next/image';

// timeago
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';

// common
import { parseStatus, parseStatusColor } from '@/utils/common';

timeago.register('ko', ko);

type ShortFormListItemProps = {
  task: ShortFormTask;
};

export default function ShortFormListItem(props: ShortFormListItemProps) {
  // props
  const { task } = props;

  // state
  const [thumbSrc, setThumbSrc] = useState<string>(
    `/api/v1/asset/${task.asset.assetId}/resource?fileType=THUMBNAIL`,
  );

  return (
    <div className="flex gap-5 rounded-box shadow-lg transition ease-in-out delay-150 hover:shadow-2xl mb-2 p-2 hover:-translate-y-1 hover:scale-100 duration-300">
      <div className="">
        <Image
          className="max-w-[200px] max-h-[100px] object-contain rounded-xl "
          src={thumbSrc}
          alt="thumbnail"
          width={200}
          height={100}
          onError={() => setThumbSrc('/default_thumbnail.png')}
        />
      </div>
      <div className="">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-4">
            <div className="tooltip w-full" data-tip={task.title}>
              <h2 className="font-bold font-xl truncate text-start">
                {task.title}
              </h2>
            </div>
          </div>
          <div className="col-span-4 text-gray-500">
            <div
              className={`badge badge-lg badge-${parseStatusColor(
                task.status,
              )}`}
            >
              {parseStatus(task.status)}
            </div>
          </div>
          <div className="col-span-4 text-gray-500 text-sm">
            <span>{task.createdBy}</span>
            <span> - </span> <TimeAgo datetime={task.createdDate} locale="ko" />
          </div>
        </div>
      </div>
    </div>
  );
}
