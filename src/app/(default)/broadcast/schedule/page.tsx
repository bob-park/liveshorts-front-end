// nextjs
import { cookies } from 'next/headers';

import BroadcastScheduleContent from './BroadcaseScheduleContents';
import BroadcastScheduleHeader from './BroadcastScheduleHeader';

const apiHost = process.env.MAM_API_HOST;

export default async function BroadcastSchedulePage() {
  // cookies
  const cookieStore = cookies();

  // get channel
  const channelsResponse = await fetch(apiHost + '/api/record/channel', {
    headers: {
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
  });

  const channelsResult = await channelsResponse.json();
  const channels = channelsResult.result
    ? channelsResult.result.map((item: any) => {
        return { channelId: item.channelId, channelName: item.channelName };
      })
    : [];

  console.log();

  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-2">
      {/* header */}
      <div className="col-span-1">
        <BroadcastScheduleHeader />
      </div>
      {/* contents */}
      <div className="col-span-1">
        <BroadcastScheduleContent channels={channels} />
      </div>
    </div>
  );
}
