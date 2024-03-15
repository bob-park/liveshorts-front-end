// nextjs
import { cookies } from 'next/headers';

import AssetHeaderContents from './AssetHeaderContents';
import AssetPlayeContents from './AssetPlayerContents';

type Asset = {
  assetId: number;
  title: string;
  description?: string;
  assetStatus: string;
  category: Category;
  createdDate: Date;
  createdBy: string;
  lastModifiedDate?: Date;
  lastModifiedBy?: string;
};

type Category = {
  categoryId: number;
  name: string;
};

// mam api host
const MAM_API_HOST = process.env.MAM_API_HOST;

export default async function AssetPage({
  params,
}: {
  params: { assetId: number };
}) {
  const { assetId } = params;

  const response = await fetch(MAM_API_HOST + `/api/asset/${assetId}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
  });

  const asset: Asset = await response.json().then((res) => res.result);

  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-2">
      {/* back drop */}
      <div className="col-span-1">
        <AssetHeaderContents />
      </div>
      <div className="col-span-1">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-10 justify-center items-center">
          <div className="col-span-2">
            <AssetPlayeContents
              assetId={assetId}
              title={asset.title}
              description={asset.description}
              createdDate={asset.createdDate}
              createdBy={asset.createdBy}
            />
          </div>
          {/* shortfrom task list */}
          <div className="col-span-1">shortform task list</div>
        </div>
      </div>
    </div>
  );
}
