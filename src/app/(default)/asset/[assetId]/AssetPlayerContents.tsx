'use client';

import AssetPlayer from '@/components/asset/AssetPlayer';
// react
import {} from 'react';

// nextjs
// react icons

// timeago
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';
import ShortFormTaskContents from './ShortFormTaskContents';

timeago.register('ko', ko);

type AssetPlayeContentsProps = {
  asset: Asset;
};

export default function AssetPlayeContents(props: AssetPlayeContentsProps) {
  // props
  const { asset } = props;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-1 ">
        <AssetPlayer
          src={`/api/v1/asset/${
            asset.assetId
          }/resource?fileType=HI_RES&${Date.now()}`}
        />
      </div>
      <div className="col-span-1 mt-2 p-5">
        <h2 className="text-xl font-bold">{asset.title}</h2>
      </div>
      <div className="col-span-1 h-32 mx-4 px-5 py-1 rounded-xl shadow-xl">
        <h4 className="text-md ">
          <span className="font-bold">{asset.createdBy}</span>
          <span> - </span>
          <span className="text-gray-500">
            <TimeAgo datetime={asset.createdDate} locale="ko" />
          </span>
        </h4>
      </div>
      <div className="col-span-1">
        <h4>{asset.description}</h4>
      </div>
    </div>
  );
}
