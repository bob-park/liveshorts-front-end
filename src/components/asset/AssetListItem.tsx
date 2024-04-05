import Image from 'next/image';

// react icons
import { SiYoutubeshorts, SiYoutube } from 'react-icons/si';

import { convertFileSize } from '@/utils/common';

import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';
import { useState } from 'react';

timeago.register('ko', ko);

type AssetListItemProps = {
  asset: Asset;
};

export default function AssetListItem(props: AssetListItemProps) {
  // props
  const { asset } = props;

  // state
  const [assetImageSrc, setAssetImageSrc] = useState<string>(
    `/api/v1/asset/${asset.assetId}/resource?fileType=THUMBNAIL`,
  );

  return (
    <div className="grid grid-cols-7 gap-4 mx-10 my-2 px-2 py-3 rounded-xl transition ease-in-out delay-150 hover:shadow-2xl hover:-translate-y-1 hover:scale-100 duration-300 cursor-pointer">
      <div className="col-span-1 h-24 flex justify-center items-center">
        <Image
          className="w-auto h-full rounded-xl object-contain"
          src={assetImageSrc}
          alt="thumbnail"
          width={200}
          height={150}
          onError={() => setAssetImageSrc('/default_thumbnail.png')}
        />
      </div>
      <div className="col-span-2 flex justify-start items-center mx-5 relative">
        <div className="tooltip max-w-full text-start" data-tip={asset.title}>
          <p className="w-full truncate font-bold">{asset.title}</p>
        </div>
        {asset.uploadSnsCount > 0 &&
          asset.shortFormCount === asset.uploadSnsCount && (
            <div className="absolute top-0 left-0">
              <div className="tooltip" data-tip="업로드">
                <SiYoutube className="w-5 h-5 text-red-600" />
              </div>
            </div>
          )}
        {asset.shortFormCount > 0 && (
          <div className="absolute top-0 left-0">
            <div className="tooltip" data-tip="숏폼">
              <SiYoutubeshorts className="w-5 h-5 text-red-600" />
            </div>
          </div>
        )}
      </div>
      <div className="col-span-1 flex justify-center items-center">
        {asset.category && (
          <div className="badge badge-outline badge-lg font-semibold text-sm">
            {asset.category.name}
          </div>
        )}
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <h3 className="">{convertFileSize(asset.fileSize)}</h3>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="">
          {asset.createdDate && (
            <div className="">
              <TimeAgo datetime={asset.createdDate} locale="ko" />
            </div>
          )}
        </div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <h3 className="">{asset.createdBy}</h3>
      </div>
    </div>
  );
}
