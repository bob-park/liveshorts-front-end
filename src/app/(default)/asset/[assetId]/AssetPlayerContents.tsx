'use client';

import AssetPlayer from '@/app/components/asset/AssetPlayer';
// react
import {} from 'react';

// nextjs
// react icons

// timeago
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';

timeago.register('ko', ko);

type AssetPlayeContentsProps = {
  assetId: Number;
  title: string;
  description?: string;
  createdDate: Date;
  createdBy: string;
  lastModifiedDate?: Date;
  lastModifiedBy?: string;
};

export default function AssetPlayeContents(props: AssetPlayeContentsProps) {
  // props
  const {
    assetId,
    title,
    description,
    createdDate,
    createdBy,
    lastModifiedDate,
    lastModifiedBy,
  } = props;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-1">
        <AssetPlayer
          src={`/api/v1/asset/${assetId}/resource?fileType=HI_RES&${Date.now()}`}
        />
      </div>
      <div className="col-span-1 mt-2">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="col-span-1">
        <h4 className="text-md text-gray-500">
          <TimeAgo datetime={createdDate} locale="ko" />
        </h4>
      </div>
      <div className="col-span-1">
        <h4>{description}</h4>
      </div>
    </div>
  );
}
