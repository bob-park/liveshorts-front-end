'use client';

import AssetPlayer from '@/app/components/asset/AssetPlayer';
// react
import {} from 'react';

// nextjs

// react icons

export default function AssetPlayeContents(props: { assetId: number }) {
  // props
  const { assetId } = props;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-1">
        <AssetPlayer
          src={`/api/v1/asset/${assetId}/resource?fileType=HI_RES&${Date.now()}`}
        />
      </div>

      {/* 엽구리 뒤졋다 */}
      {/* <a
        href="/api/v1/shorts/task/2024-204f72a0-32aa-43c3-80ef-ec5f2a48f581/resource/download"
        download
      >
        download
      </a> */}
    </div>
  );
}
