import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import './globals.css';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const MAM_API_HOST = process.env.MAM_API_HOST;

export default async function LoginLayout({
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

  if (touchReponse.ok) {
    redirect('/');
  }

  return <>{children}</>;
}
