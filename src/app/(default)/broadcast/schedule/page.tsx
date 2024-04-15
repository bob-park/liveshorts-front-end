// nextjs
import { cookies } from 'next/headers';

import BroadcastScheduleContent from './_component/BroadcaseScheduleContents';
import BroadcastScheduleHeader from './_component/BroadcastScheduleHeader';
import dayjs from 'dayjs';

const apiHost = process.env.MAM_API_HOST;

export default async function BroadcastSchedulePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // cookies
  const cookieStore = cookies();

  // get channel
  const channelsResponse = await fetch(apiHost + '/api/record/channel', {
    headers: {
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
  });

  const channels = await channelsResponse
    .json()
    .then((res: ApiResponse<RecordChannel[]>) => res.result);

  const channelId = Number(searchParams.channelId) || channels[0].channelId;
  const date =
    (searchParams.date as string) || dayjs(new Date()).format('YYYY-MM-DD');

  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-2">
      {/* header */}
      <div className="col-span-1">
        <BroadcastScheduleHeader />
      </div>
      {/* contents */}
      <div className="col-span-1">
        <BroadcastScheduleContent
          channels={channels}
          selectChannelId={channelId}
          selectDate={date}
        />
      </div>
    </div>
  );
}
