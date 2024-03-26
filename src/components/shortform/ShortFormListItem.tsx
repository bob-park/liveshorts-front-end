import { useState } from 'react';

import Image from 'next/image';

// react icon
import { TbTransferIn } from 'react-icons/tb';
import { SiYoutube } from 'react-icons/si';
import { FiDownload } from 'react-icons/fi';
import { FaRegEdit } from 'react-icons/fa';
import { LuCopyPlus } from 'react-icons/lu';

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
      <div className="flex-auto">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-4">
            <div className="tooltip w-full" data-tip={task.title}>
              <h2 className="font-bold font-xl truncate text-start">
                {task.title}
              </h2>
            </div>
          </div>
          <div className="col-span-4 text-gray-500">
            <div className="flex gap-4 items-center">
              <div
                className={`badge badge-lg badge-${parseStatusColor(
                  task.status,
                )}`}
              >
                {parseStatus(task.status)}
              </div>
              {task.taskExtras && task.taskExtras.length > 0 && (
                <div className="">
                  <div className="tooltip w-full" data-tip="입수 영상 작업됨">
                    <TbTransferIn className="w-6 h-6 font-extrabold transition ease-in-out delay-150 hover:scale-110 duration-300" />
                  </div>
                </div>
              )}

              {task.uploadInstances && task.uploadInstances.length > 0 && (
                <div className="">
                  <div className="tooltip w-full" data-tip="업로드 됨">
                    <SiYoutube className="w-6 h-6 text-red-600 font-extrabold transition ease-in-out delay-150 hover:scale-110 duration-300" />
                  </div>
                </div>
              )}

              <div
                className="flex-1 text-end"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="flex gap-3 justify-end mr-2">
                  <div className="tooltip" data-tip="숏폼 편집">
                    <button className="btn btn-sm btn-neutral" type="button">
                      <FaRegEdit className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="tooltip" data-tip="숏폼 복사">
                    <button className="btn btn-sm btn-neutral" type="button">
                      <LuCopyPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="tooltip" data-tip="다운로드">
                    <a
                      className={`btn btn-sm btn-neutral ${
                        task.status !== 'SUCCESS' && 'btn-disabled'
                      }`}
                      href={`/api/v1/shorts/task/${task.id}/resource/download`}
                      download
                    >
                      <FiDownload className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
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
