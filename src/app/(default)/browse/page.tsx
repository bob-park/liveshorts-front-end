// nextjs
import { cookies } from 'next/headers';

import SearchAsseResult from './_component/SearchAsseResult';
import dayjs from 'dayjs';

const COOKIE_NAME_IS_LIST_VIEW = 'isListView';

const apiHost = process.env.MAM_API_HOST;

export default async function Browse(props: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { searchParams } = props;

  // cookies
  const cookieStore = cookies();

  const isListViewCookie = cookieStore.get(COOKIE_NAME_IS_LIST_VIEW);
  const preIsListView = isListViewCookie?.value == 'true';

  const searchAssetParams = {
    title: searchParams.title as string,
    isShortForm:
      searchParams.isShortForm == undefined || searchParams.isShortForm === ''
        ? undefined
        : searchParams.isShortForm == 'true',
    broadcastDate:
      (searchParams.broadcastDate as string) || dayjs().format('YYYY-MM-DD'),
    onlyCreateShortFormByMe: searchParams.onlyCreateShortFromByMe == 'true',
    channelId: searchParams.channelId
      ? Number(searchParams.channelId)
      : undefined,
    page: Number(searchParams.page || 0),
    size: Number(searchParams.size || 30),
  };

  // get channel
  const channelsResponse = await fetch(apiHost + '/api/record/channel', {
    headers: {
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
  });

  const channels = await channelsResponse
    .json()
    .then((res: ApiResponse<RecordChannel[]>) => res.result);

  return (
    <div>
      <SearchAsseResult
        isListView={preIsListView}
        searchAssetParams={searchAssetParams}
        channels={channels}
      />
    </div>
  );
}
