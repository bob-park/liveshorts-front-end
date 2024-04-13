import delay from '@/utils/delay';

// login
export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  await delay(1_000);

  const response = await fetch(`/api/user/login`, {
    method: 'post',
    next: { tags: ['user', 'login'] },
    // cache 안할때
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      clientType: 'CLIP',
      userId: username,
      password: password,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res: ApiResponse<LoginResponse>) => res.result);
}
