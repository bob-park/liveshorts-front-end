// nextjs
import { cookies } from 'next/headers';

import SearchAsseResult from './SearchAsseResult';
import dayjs from 'dayjs';

const COOKIE_NAME_IS_LIST_VIEW = 'isListView';

export default function Browse(props: {
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
    isShortForm: searchParams.isShortForm == 'true',
    broadcastDate:
      (searchParams.broadcastDate as string) || dayjs().format('YYYY-MM-DD'),
    channelId: Number(searchParams.channelId),
    page: Number(searchParams.page || 0),
    size: Number(searchParams.size || 20),
  };

  return (
    <div>
      <SearchAsseResult
        isListView={preIsListView}
        searchAssetParams={searchAssetParams}
      />
    </div>
  );
}
