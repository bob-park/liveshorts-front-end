import Image from 'next/image';

import { convertFileSize } from '@/utils/common';

import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';
import { useState } from 'react';

timeago.register('ko', ko);

type AssetListItemProps = {
  assetId: number;
  title: string;
  fileSize?: number;
  assetStatus: AssetStatus;
  category?: string;
  createdDate?: Date;
  createdBy?: string;
};

export default function AssetListItem(props: AssetListItemProps) {
  // props
  const {
    assetId,
    title,
    fileSize,
    assetStatus,
    category,
    createdDate,
    createdBy,
  } = props;

  // state
  const [assetImageSrc, setAssetImageSrc] = useState<string>(
    `/api/v1/asset/${assetId}/resource?fileType=THUMBNAIL`,
  );

  return (
    <div className="grid grid-cols-7 gap-4 mx-10 my-2 p-1 rounded-xl transition ease-in-out delay-150 hover:shadow-2xl hover:-translate-y-1 hover:scale-100 duration-300">
      <div className="col-span-1 h-24 flex justify-center items-center ">
        <Image
          className="rounded-md w-auto h-full"
          src={assetImageSrc}
          alt="thumbnail"
          width={200}
          height={150}
          onError={() => setAssetImageSrc('/default_thumbnail.png')}
        />
      </div>
      <div className="col-span-2 flex justify-center items-center mx-5">
        <div className="tooltip w-full text-start" data-tip={title}>
          <p className="w-full truncate font-bold">{title}</p>
        </div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        {category && (
          <div className="badge badge-outline badge-lg font-semibold text-sm">
            {category}
          </div>
        )}
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <h3 className="">{convertFileSize(fileSize)}</h3>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="">
          {createdDate && (
            <div className="">
              <TimeAgo datetime={createdDate} locale="ko" />
            </div>
          )}
        </div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <h3 className="">{createdBy}</h3>
      </div>
    </div>
  );
}
