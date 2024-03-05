import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

  return <div className="w-full">{children}</div>;
}
