'use client';

// nextjs
import Image from 'next/image';
import { useState } from 'react';

// react icons
import { SiYoutubeshorts, SiYoutube } from 'react-icons/si';

// timeago
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';

timeago.register('ko', ko);

type AssetItemProps = {
  asset: Asset;
};

export default function AssetViewItem(props: AssetItemProps) {
  // props
  const { asset } = props;

  // state
  const [assetImageSrc, setAssetImageSrc] = useState<string>(
    `/api/v1/asset/${asset.assetId}/resource?fileType=THUMBNAIL`,
  );

  // handle

  return (
    <div className="card w-96 bg-base-100 shadow-xl transition ease-in-out delay-150 hover:shadow-2xl hover:-translate-y-1 hover:scale-110 duration-300 px-2 pt-6 cursor-pointer">
      <figure className="w-full h-48">
        <Image
          className="w-auto h-full rounded-md "
          src={assetImageSrc}
          alt="thumbnail"
          width={400}
          height={300}
          onError={() => setAssetImageSrc('/default_thumbnail.png')}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          <div className="tooltip w-full" data-tip={asset.title}>
            <p className="w-full truncate font-bold text-start">
              {asset.title}
            </p>
          </div>
        </h2>
        <p className="pt-4"></p>
        <div className="card-actions justify-between">
          {asset.createdDate && (
            <div className="">
              <TimeAgo
                datetime={
                  asset.recordSchedule?.startDateTime || asset.createdDate
                }
                locale="ko"
              />
            </div>
          )}
          <div className="flex gap-3 justify-end items-center">
            {asset.shortFormCount > 0 && (
              <div className="tooltip" data-tip="숏폼">
                <SiYoutubeshorts className="w-5 h-5 text-red-600" />
              </div>
            )}
            {asset.uploadSnsCount > 0 &&
              asset.shortFormCount === asset.uploadSnsCount && (
                <div className="tooltip" data-tip="업로드">
                  <SiYoutube className="w-5 h-5 text-red-600" />
                </div>
              )}
            {asset.recordSchedule && (
              <div className="badge badge-outline badge-lg font-semibold text-sm">
                {asset.recordSchedule.channel.channelName}
              </div>
            )}
            {asset.category && (
              <div className="badge badge-outline badge-lg font-semibold text-sm">
                {asset.category.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
