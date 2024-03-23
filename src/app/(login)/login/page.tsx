'use client';

// react
import { useState, useLayoutEffect } from 'react';

// nextjs
import LoginForm from '@/components/user/LoginForm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// hooks
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

// action
import { userActions } from '@/store/user';

const { requestLoggedIn } = userActions;

export default function LoginPage() {
  // router
  const router = useRouter();

  // store
  const dispatch = useAppDispatch();
  const { isLoggingIn, isLoggedIn, failLoggedInMessage, me } = useAppSelector(
    (state) => state.user,
  );

  // state

  // useEffect
  useLayoutEffect(() => {
    if (me) {
      router.push('/');
    }
  }, [me]);

  // handler
  const handleLogin = async (userId: string, password: string) => {
    dispatch(requestLoggedIn({ userId, password }));
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 gap-4 justify-items-center content-center">
      <div className="fade-in">
        <Image alt="logo" src="/logo.png" width={300} height={100} />
      </div>
      <LoginForm
        isLoggingIn={isLoggingIn}
        isLoggedIn={isLoggedIn}
        msg={failLoggedInMessage}
        onLogin={handleLogin}
      />
    </div>
  );
}
