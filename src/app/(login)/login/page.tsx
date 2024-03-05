'use client';

// nextjs
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

// daisyui
import { Button } from 'react-daisyui';

// react icons
import { RiUserFill, RiLock2Fill } from 'react-icons/ri';

export default function Login() {
  // router
  const router = useRouter();

  // state
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('/api/user/login', {
      method: 'post',
      body: JSON.stringify({
        clientType: 'CLIP',
        userId,
        password,
      }),
    });

    if (response.ok) {
      router.push('/');
    }
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 gap-4 justify-items-center content-center">
      <div className="fade-in">
        <Image alt="logo" src="/logo.png" width={300} height={100} />
      </div>
      <form
        className="grid grid-cols-4 gap-3 w-72 mt-5 fade-in "
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
          <Button className="w-full" type="submit" animation color="neutral">
            로그인
          </Button>
        </div>
      </form>
    </div>
  );
}
