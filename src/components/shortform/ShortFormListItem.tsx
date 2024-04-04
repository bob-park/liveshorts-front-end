import { useState } from 'react';

import Image from 'next/image';

// react icon
import { TbTransferIn } from 'react-icons/tb';
import { SiYoutube } from 'react-icons/si';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
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
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
  onCopy?: (id: string) => void;
};

export default function ShortFormListItem(props: ShortFormListItemProps) {
  // props
  const { task, onEdit, onRemove, onCopy } = props;

  // state
  const [thumbSrc, setThumbSrc] = useState<string>(
    `/api/v1/asset/${task.asset.assetId}/resource?fileType=THUMBNAIL`,
  );

  // handle
  const handleEdit = () => {
    onEdit && onEdit(task.id);
  };

  const handleRemove = () => {
    onRemove && onRemove(task.id);
  };

  const handleCopy = () => {
    onCopy && onCopy(task.id);
  };

  return (
    <div className="flex gap-5 items-center rounded-box shadow-lg transition ease-in-out delay-150 hover:shadow-2xl mb-2 p-2 hover:-translate-y-1 hover:scale-100 duration-300">
      <div className="pl-2 max-w-48 ">
        <Image
          className="w-full max-h-48 object-contain aspect-auto rounded-xl "
          src={thumbSrc}
          alt="thumbnail"
          width={200}
          height={100}
          onError={() => setThumbSrc('/default_thumbnail.png')}
        />
      </div>
      <div className="flex-1">
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
            </div>

            <div
              className="flex gap-3 justify-start mt-2 mr-2"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="tooltip" data-tip="편집">
                <button
                  className="btn btn-sm btn-neutral"
                  type="button"
                  onClick={handleEdit}
                >
                  <FaRegEdit className="w-4 h-4" />
                </button>
              </div>
              <div className="tooltip" data-tip="복사">
                <button
                  className="btn btn-sm btn-neutral"
                  type="button"
                  onClick={handleCopy}
                >
                  <LuCopyPlus className="w-4 h-4" />
                </button>
              </div>
              <div className="tooltip" data-tip="삭제">
                <button
                  className="btn btn-sm btn-neutral"
                  type="button"
                  onClick={handleRemove}
                >
                  <FaTrashAlt className="w-4 h-4" />
                </button>
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
