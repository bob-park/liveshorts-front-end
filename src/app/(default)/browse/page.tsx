// nextjs
import { cookies } from 'next/headers';

import SearchAsseResult from './SearchAsseResult';

const COOKIE_NAME_IS_LIST_VIEW = 'isListView';

export default function Browse() {
  // cookies
  const cookieStore = cookies();

  const isListViewCookie = cookieStore.get(COOKIE_NAME_IS_LIST_VIEW);
  const preIsListView = isListViewCookie?.value == 'true';

  return (
    <div>
      <SearchAsseResult isListView={preIsListView} />
    </div>
  );
}
