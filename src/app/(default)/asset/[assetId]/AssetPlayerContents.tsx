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
        {/* <video src={`/api/v1/asset/${assetId}/resource?fileType=HI_RES`} /> */}
        <AssetPlayer
          src={`/api/v1/asset/${assetId}/resource?fileType=HI_RES`}
        />
      </div>
    </div>
  );
}