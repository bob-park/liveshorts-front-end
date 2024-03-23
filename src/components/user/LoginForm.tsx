'use client';

// react
import { useState, FormEvent } from 'react';

// daisyui
import { Button } from 'react-daisyui';

// react icons
import { RiUserFill, RiLock2Fill } from 'react-icons/ri';

type LoginFormProps = {
  msg?: string;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  onLogin?: (userId: string, password: string) => void;
};

export default function LoginForm(props: LoginFormProps) {
  // props
  const { onLogin, isLoggingIn, isLoggedIn, msg } = props;

  // state
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // handle
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onLogin && onLogin(userId, password);
  };

  return (
    <form
      className="grid grid-cols-4 gap-3 w-80 mt-5 fade-in "
      onSubmit={handleSubmit}
    >
      <div className="col-span-4">
        <label className="input input-bordered flex items-center gap-2">
          <RiUserFill />
          <input
            type="text"
            className="grow input-secondary"
            required
            autoFocus
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
      </div>
      <div className="col-span-4">
        <label className="input input-bordered flex items-center gap-2">
          <RiLock2Fill />
          <input
            type="password"
            className="grow input-secondary"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <div className="col-span-4">
        <Button
          className={`w-full`}
          type="submit"
          animation
          color="neutral"
          loading={isLoggingIn}
          disabled={isLoggingIn || isLoggedIn}
        >
          {!isLoggedIn && isLoggingIn && '로그인 중'}
          {!isLoggedIn && !isLoggingIn && '로그인'}
          {isLoggedIn && !isLoggingIn && '로그인 완료'}
        </Button>
      </div>

      {msg && (
        <div className="col-span-4 fade-in">
          <div role="alert" className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{msg}</span>
          </div>
        </div>
      )}
    </form>
  );
}
