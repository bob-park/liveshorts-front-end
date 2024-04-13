export async function getUserDetail(id: number) {
  const response = await fetch(`/api/user/${id}`, {
    next: {
      tags: ['user', 'detail'],
    },
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res: ApiResponse<User>) => res.result);
}
