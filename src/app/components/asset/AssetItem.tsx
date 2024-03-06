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
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure className="w-full relative h-48">
        <Image
          src={`/api/v1/asset/${assetId}/resource?fileType=THUMBNAIL`}
          alt="thumbnail"
          fill
          sizes="(min-width: 60em) 24vw"
          priority
          onError={(e) => (e.currentTarget.src = '/default_thumbnail.png')}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          <div className="tooltip w-full" data-tip={title}>
            <p className="w-full truncate font-bold text-start">{title}</p>
          </div>
        </h2>
        <p className="pt-4"></p>
        <div className="card-actions justify-between">
          {createdDate && (
            <div className="">
              <TimeAgo datetime={createdDate} locale="ko" />
            </div>
          )}
          {category && (
            <div className="badge badge-outline badge-lg font-semibold text-sm">
              {category}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
