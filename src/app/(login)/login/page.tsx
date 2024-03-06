'use client';

// react
import { useState } from 'react';

// nextjs
import LoginForm from '@/app/components/user/LoginForm';
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
  const { isLoggingIn, failLoggedInMessage } = useAppSelector(
    (state) => state.user,
  );

  // state

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
        msg={failLoggedInMessage}
        onLogin={handleLogin}
      />
    </div>
  );
}
