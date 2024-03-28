// nextjs
import { cookies } from 'next/headers';

import SearchAsseResult from './SearchAsseResult';
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

  const channelsResult = await channelsResponse.json();
  const channels = channelsResult.result
    ? channelsResult.result.map((item: any) => {
        return { channelId: item.channelId, name: item.channelName };
      })
    : [];

  async function setIsListView(listView: boolean) {
    'use server';
    cookies().set(COOKIE_NAME_IS_LIST_VIEW, listView + '');
  }

  return (
    <div>
      <SearchAsseResult
        isListView={preIsListView}
        searchAssetParams={searchAssetParams}
        channels={channels}
        updateListViewMode={setIsListView}
      />
    </div>
  );
}
