'use client';

import AssetPlayer from '@/components/asset/AssetPlayer';

// react
import React from 'react';

// nextjs

// react icons

// dayjs
import dayjs from 'dayjs';

// timeago
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';

timeago.register('ko', ko);

type AssetPlayeContentsProps = {
  asset: Asset;
  channels?: RecordChannel[];
};

const displaySchemaIds = [
  '2023-188b5364-22ff-47bf-8bcf-d4f9e9fccbee',
  '2023-5766cffb-215a-47e2-a14c-d9eb1b821c5d',
  '2023-2d85a87f-1243-41d8-8083-5b7f58b9702f',
];
const channelSchemaId = '2024-1de7a2cd-72c6-4057-87d3-97926a85e0bb';

const includeSchemaIds = displaySchemaIds.concat([channelSchemaId]);

export default function AssetPlayeContents(props: AssetPlayeContentsProps) {
  // props
  const { asset, channels } = props;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-1">
        <AssetPlayer
          src={`/api/v1/asset/${
            asset.assetId
          }/resource?fileType=HI_RES&${Date.now()}`}
          poster={`/api/v1/asset/${
            asset.assetId
          }/resource?fileType=THUMBNAIL&${Date.now()}`}
        />
      </div>
      <div className="col-span-1 mt-2 p-5">
        <h2 className="text-xl font-bold">{asset.title}</h2>
      </div>
      <div className="col-span-1 mx-4 px-5 py-1 rounded-xl shadow-xl">
        <h4 className="text-md">
          <span className="font-bold">{asset.createdBy}</span>
          <span> - </span>
          <span className="text-gray-500">
            <TimeAgo datetime={asset.createdDate} locale="ko" />
          </span>
        </h4>
        <div className="mx-1 my-4">
          {/* 대분류, 중분류, 소분류 */}
          <div className="flex gap-4">
            {asset.assetMetadataList
              .filter((item) =>
                displaySchemaIds.some(
                  (displaySchemaId) => displaySchemaId === item.schema.schemaId,
                ),
              )
              .map((item) => (
                <span
                  key={`asset-metas-${item.assetMetadataId}`}
                  className="badge badge-lg badge-neutral"
                >
                  {item.metadataValue}
                </span>
              ))}
          </div>

          <div className="grid grid-cols-5 gap-4 items-center my-4 py-4">
            {/* 방송 채널 */}
            {asset.assetMetadataList
              .filter((item) => item.schema.schemaId === channelSchemaId)
              .map((item) => (
                <React.Fragment
                  key={`asset-meta-broadcast-channel-${item.assetMetadataId}`}
                >
                  <div className="col-span-1 text-right">
                    <h3 className="text-lg ">방송 채널 :</h3>
                  </div>
                  <div className="col-span-4 text-lg font-bold text-left">
                    {channels
                      ?.filter(
                        (channel) =>
                          Number(item.metadataValue) === channel?.channelId,
                      )
                      .map((channel) => (
                        <h3
                          key={`asset-meta-broadcast-channle-name-${item.assetMetadataId}`}
                        >
                          {channel.channelName}
                        </h3>
                      ))}
                  </div>
                </React.Fragment>
              ))}

            {/* 나머지 메타데이터 */}
            {asset.assetMetadataList
              .filter((item) =>
                includeSchemaIds.every(
                  (includeSchemaId) => includeSchemaId !== item.schema.schemaId,
                ),
              )
              .map((item) => (
                <React.Fragment
                  key={`asset-metadata-etc-${item.assetMetadataId}`}
                >
                  <div className="col-span-1 text-lg text-right">
                    <h3 className=" ">{item.schema.name} :</h3>
                  </div>
                  <div className="col-span-4 text-lg font-bold text-left">
                    <h3 className="">
                      {dayjs(item.metadataValue, 'YYYY-MM-DD').format(
                        'YYYY년 MM월 DD일',
                      )}
                    </h3>
                  </div>
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
      <div className="col-span-1">
        <h4>{asset.description}</h4>
      </div>
    </div>
  );
}
