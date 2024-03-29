// nextjs
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import ShortformHeader from './ShortformHeader';
import ShortformContents from './ShortformContents';

// mam api host
const MAM_API_HOST = process.env.MAM_API_HOST;

type Props = {
  params: { assetId: number; shortformId: number };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { shortformId } = params;

  const response = await fetch(
    MAM_API_HOST + `/api/v1/shorts/task/${shortformId}`,
    {
      method: 'get',
      headers: {
        Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
      },
    },
  );

  const shortform: ShortFormTask = await response
    .json()
    .then((res) => res.result);

  return {
    title: `LiveShorts - ${shortform.title}`,
  };
}

export default async function ShortFormPage({ params }: Props) {
  const { assetId, shortformId } = params;

  const headers = {
    Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
  };

  const response = await fetch(
    MAM_API_HOST + `/api/v1/shorts/task/${shortformId}`,
    {
      method: 'get',
      headers,
    },
  );

  const shortsResponse = await fetch(
    MAM_API_HOST + `/api/v1/shorts/task/search?assetId=${assetId}`,
    {
      method: 'get',
      headers: headers,
    },
  );

  const shortform: ShortFormTask = await response
    .json()
    .then((res) => res.result);

  const shortformList: ShortFormTask[] = await shortsResponse
    .json()
    .then((res) =>
      res.result.filter((item: ShortFormTask) => item.status === 'SUCCESS'),
    );

  const nowIndex = shortformList.findIndex((item) => item.id === shortform.id);
  const prevShortformId = nowIndex > 0 && shortformList[nowIndex - 1].id;
  const nextShortformId =
    nowIndex > -1 &&
    nowIndex + 1 < shortformList.length &&
    shortformList[nowIndex + 1].id;

  return (
    <div className="grid grid-cols-1 gap-2 px-5 py-2">
      {/* back drop */}
      <div className="">
        <ShortformHeader />
      </div>
      {/* contents */}
      <div className="w-full h-[calc(100lvh-12rem)]">
        <ShortformContents
          shortform={shortform}
          prevShortformId={prevShortformId}
          nextShortformId={nextShortformId}
        />
      </div>
    </div>
  );
}
