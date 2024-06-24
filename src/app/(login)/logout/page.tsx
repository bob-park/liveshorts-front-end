// nextjs
import { cookies } from 'next/headers';
import LogoutContents from './_component/LogoutContents';

const apiHost = process.env.MAM_API_HOST;
const COOKIE_NAME = 'accessToken';

export default async function LogoutPage() {
  // cookies
  const cookieStore = cookies();

  // get channel
  const logoutResponse = await fetch(apiHost + '/api/user/logout', {
    headers: {
      Authorization: `Bearer ${cookieStore.get(COOKIE_NAME)?.value}`,
    },
  });

  return (
    <div className="flex gap-x-2 justify-center items-center w-screen h-screen">
      <LogoutContents />
    </div>
  );
}
