'use client';

// nextjs
import Image from 'next/image';

import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';

timeago.register('ko', ko);

type AssetItemProps = {
  assetId: number;
  title: string;
  assetStatus: AssetStatus;
  category?: string;
  createdDate?: Date;
};

export default function AssetItem(props: AssetItemProps) {
  // props
  const { assetId, title, assetStatus, category, createdDate } = props;

  // handle

  return (
    <div className="flex flex-col gap-4 w-64 p-3 rounded-lg shadow-xl">
      <div className="w-full relative h-32">
        <Image
          src={`/api/v1/asset/${assetId}/resource?fileType=THUMBNAIL`}
          alt="thumbnail"
          fill
          sizes="(min-width: 60em) 24vw"
          priority
          onError={(e) => (e.currentTarget.src = '/default_thumbnail.png')}
        />
      </div>
      <div className="w-full">
        <div className="tooltip w-full" data-tip={title}>
          <p className="w-full truncate font-bold text-start">{title}</p>
        </div>
      </div>
      <div className="h-4 w-full">
        {category && (
          <div className="badge badge-outline badge-lg font-semibold text-sm">
            {category}
          </div>
        )}
      </div>
      <div className="h-4 w-full text-sm text-gray-500">
        {createdDate && (
          <div className="">
            <TimeAgo datetime={createdDate} locale="ko" />
          </div>
        )}
      </div>
    </div>
  );
}
