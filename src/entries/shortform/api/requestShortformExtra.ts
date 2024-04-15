export async function requestExtra(taskId: string, extraTypeId: string) {
  const response = await fetch(`/api/v1/shorts/task/${taskId}/extra`, {
    method: 'post',
    next: {
      tags: ['shortforms', 'request', taskId + '', 'extra'],
    },
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ extraTypeIds: [extraTypeId] }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res: ApiResponse<ShortFormTask>) => res.result);
}
