import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NavBar from './NavBar';

// mam api host
const MAM_API_HOST = process.env.MAM_API_HOST;

export default async function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const touchReponse = await fetch(MAM_API_HOST + '/api/user/session/touch', {
    method: 'post',
    headers: {
      Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
  });

  if (!touchReponse.ok) {
    redirect('/login');
  }

  const touchResult = await touchReponse.json();

  return (
    <div className="w-full h-full min-w-[500px]">
      <NavBar token={touchResult.result.accessToken} />
      <div className="p-2">{children}</div>
    </div>
  );
}
