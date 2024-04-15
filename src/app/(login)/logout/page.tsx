// nextjs
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
      <span className="loading loading-infinity loading-lg" />
      <h4 className="font-bold text-xl">loading...</h4>
    </div>
  );
}
