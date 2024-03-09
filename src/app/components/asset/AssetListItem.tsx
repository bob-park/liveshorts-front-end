import Image from 'next/image';

import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';

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

  return (
    <div className="grid grid-cols-7 gap-4 mx-10 my-2 p-1 rounded-xl hover:shadow-2xl">
      <div className="col-span-1 h-24 flex justify-center items-center ">
        <Image
          className="rounded-md w-auto h-full"
          src={`/api/v1/asset/${assetId}/resource?fileType=THUMBNAIL`}
          alt="thumbnail"
          width={200}
          height={150}
          onError={(e) => (e.currentTarget.src = '/default_thumbnail.png')}
        />
      </div>
      <div className="col-span-2 flex justify-center items-center mx-5">
        <div className="tooltip w-full" data-tip={title}>
          <p className="w-full truncate font-bold text-start">{title}</p>
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
        <h3 className="">{fileSize}</h3>
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
