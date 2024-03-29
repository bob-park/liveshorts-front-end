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
  assetId: number;
  title: string;
  assetStatus: AssetStatus;
  category?: string;
  createdDate?: Date;
  existShortForm?: boolean;
  isUploadSns?: boolean;
};

export default function AssetViewItem(props: AssetItemProps) {
  // props
  const {
    assetId,
    title,
    assetStatus,
    category,
    createdDate,
    existShortForm,
    isUploadSns,
  } = props;

  // state
  const [assetImageSrc, setAssetImageSrc] = useState<string>(
    `/api/v1/asset/${assetId}/resource?fileType=THUMBNAIL`,
  );

  // handle

  return (
    <div className="card w-96 bg-base-100 shadow-xl transition ease-in-out delay-150 hover:shadow-2xl hover:-translate-y-1 hover:scale-110 duration-300">
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
          <div className="flex gap-3 justify-end items-center">
            {existShortForm && (
              <div className="tooltip" data-tip="숏폼">
                <SiYoutubeshorts className="w-5 h-5 text-red-600" />
              </div>
            )}
            {isUploadSns && (
              <div className="tooltip" data-tip="업로드">
                <SiYoutube className="w-5 h-5 text-red-600" />
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
    </div>
  );
}
