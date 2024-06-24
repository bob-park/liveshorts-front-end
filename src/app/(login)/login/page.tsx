'use client';

// react
import { useEffect, useState } from 'react';

// nextjs
import LoginForm from '@/components/user/LoginForm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// query client
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { login } from '@/entries/user/api/requestAuth';
import { useStore } from '@/shared/rootStore';

export default function LoginPage() {
  // router
  const router = useRouter();

  // store
  const updateMe = useStore((state) => state.updateMe);
  const initAssetPage = useStore((state) => state.initAssetPage);

  // state
  const [errMessage, setErrMessage] = useState<string>();

  // query client
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['user', 'accessToken'],
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'accessToken'] });
      setErrMessage('');
      updateMe(data.accessToken);

      // browse 폴더로 이동
      router.replace('/browse');
    },
    onError: () => {
      setErrMessage('아이디 또는 패스워드가 올바르지 않습니다.');
    },
  });

  //useEffect
  useEffect(() => {
    queryClient.removeQueries({ queryKey: ['assets', 'search'] });
    initAssetPage();

    console.log('init assets.');
  }, []);

  // handler
  const handleLogin = async (userId: string, password: string) => {
    mutate({ username: userId, password });
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 gap-4 justify-items-center content-center">
      <div className="fade-in">
        <Image alt="logo" src="/logo.png" width={300} height={100} />
      </div>
      <LoginForm
        isLoggingIn={isPending}
        isLoggedIn={false}
        msg={errMessage}
        onLogin={handleLogin}
      />
    </div>
  );
}
