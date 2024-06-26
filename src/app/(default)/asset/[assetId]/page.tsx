// nextjs
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';

import AssetHeaderContents from './_component/AssetHeaderContents';
import AssetPlayerContents from './_component/AssetPlayerContents';
import ShortFormTaskContents from './_component/ShortFormTaskContents';

// mam api host
const MAM_API_HOST = process.env.MAM_API_HOST;

type Props = {
  params: { assetId: number };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { assetId } = params;

  const response = await fetch(MAM_API_HOST + `/api/asset/${assetId}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
  });

  const asset: Asset = await response.json().then((res) => res.result);

  return {
    title: `ShortBob - ${asset.title}`,
  };
}

export default async function AssetPage({ params }: Props) {
  const { assetId } = params;

  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-2">
      {/* back drop */}
      <div className="col-span-1">
        <AssetHeaderContents />
      </div>
      <div className="col-span-1">
        <div className="grid grid-cols-2 2xl:grid-cols-3 gap-10 justify-center items-start">
          <div className="col-span-2">
            <AssetPlayerContents assetId={assetId} />
          </div>
          {/* shortfrom task list */}
          <div className="col-span-2 2xl:col-span-1">
            <ShortFormTaskContents assetId={assetId} />
          </div>
        </div>
      </div>
    </div>
  );
}
