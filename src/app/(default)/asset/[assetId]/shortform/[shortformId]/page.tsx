// nextjs
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import ShortformHeader from './ShortformHeader';
import ShortformContents from './ShortformContents';

// mam api host
const MAM_API_HOST = process.env.MAM_API_HOST;

type Props = {
  params: { shortformId: number };
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

  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-2">
      {/* back drop */}
      <div className="">
        <ShortformHeader />
      </div>

      {/* contents */}
      <div className="w-full h-[calc(100lvh-15rem)]">
        <ShortformContents shortform={shortform} />
      </div>
    </div>
  );
}
