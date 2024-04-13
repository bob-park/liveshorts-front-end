import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NavbarMenu from './NavbarMenu';
import './globals.css';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

const MAM_API_HOST = process.env.MAM_API_HOST;

export default async function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  const touch = async () => {
    const response = await fetch(MAM_API_HOST + '/api/user/session/touch', {
      method: 'post',
      headers: {
        Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error('Unauthorized');
    }

    return response
      .json()
      .then((res: ApiResponse<LoginResponse>) => res.result);
  };

  await queryClient.prefetchQuery({
    queryKey: ['user', 'accessToken'],
    queryFn: touch,
  });

  const dehydratedState = dehydrate(queryClient);

  const state = queryClient.getQueryState(['user', 'accessToken']);

  if (state?.status === 'error') {
    redirect('/login');
  }

  return (
    <div className="w-full h-full min-w-[900px]">
      <HydrationBoundary state={dehydratedState}>
        <NavbarMenu />
        <div className="p-2 ">{children}</div>
      </HydrationBoundary>
    </div>
  );
}
