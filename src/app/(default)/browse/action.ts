'use server';

// nextjs
import { cookies } from 'next/headers';

const COOKIE_NAME_IS_LIST_VIEW = 'isListView';

export async function setIsListView(listView: boolean) {
  cookies().set(COOKIE_NAME_IS_LIST_VIEW, listView + '');
}
