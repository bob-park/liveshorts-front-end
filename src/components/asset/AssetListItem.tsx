import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';
import { useState } from 'react';
import dayjs from 'dayjs';

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
    <div className="grid grid-cols-8 gap-4 mx-10 px-4 py-6 rounded-xl transition ease-in-out delay-150 hover:shadow-2xl hover:-translate-y-1 hover:scale-100 duration-150 cursor-pointer">
      <div className="col-span-3 flex justify-start items-center mx-5 relative">
        <div
          className="tooltip max-w-full text-start text-lg"
          data-tip={asset.title}
        >
          <p className="w-full truncate font-bold">{asset.title}</p>
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex justify-center items-center h-full">
          {asset.recordSchedule?.channel.channelName}
        </div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        {asset.category.name}
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <p className="">
          <span>{asset.shortFormCount > 0 ? 'O' : 'X'}</span>
        </p>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <p className="">
          <span>
            {asset.uploadSnsCount > 0 &&
            asset.shortFormCount === asset.uploadSnsCount
              ? 'O'
              : 'X'}
          </span>
        </p>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="">
          {asset.recordSchedule ? (
            <p>
              <span>
                {dayjs(asset.recordSchedule.startDateTime).format('HH:mm')}
              </span>
              <span> ~ </span>
              <span>
                {dayjs(asset.recordSchedule.endDateTime).format('HH:mm')}
              </span>
            </p>
          ) : (
            <p>
              <TimeAgo datetime={asset.createdDate} locale="ko" />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
