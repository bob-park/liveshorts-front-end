import delay from '@/utils/delay';

export async function getTasksByAssetId(assetId: number) {
  const response = await fetch(
    `/api/v1/shorts/task/search?assetId=${assetId}`,
    {
      method: 'get',
      next: {
        tags: ['shortforms', assetId + ''],
      },
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  await delay(1_000);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response
    .json()
    .then((res: ApiResponse<ShortFormTask[]>) => res.result);
}

export async function getTask(taskId: string) {
  const response = await fetch(`/api/v1/shorts/task/${taskId}`, {
    method: 'get',
    next: {
      tags: ['shortforms', 'detail', taskId],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res: ApiResponse<ShortFormTask>) => res.result);
}

export async function addTask(assetId: number, title: string) {
  const response = await fetch(`/api/v1/shorts/task`, {
    method: 'post',
    next: {
      tags: ['shortforms', assetId + ''],
    },
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      assetId,
      title,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res: ApiResponse<ShortFormTask>) => res.result);
}

export async function updateTask(
  taskId: string,
  body: { templateId?: string; title?: string; options?: any },
) {
  const response = await fetch(`/api/v1/shorts/task/${taskId}`, {
    method: 'put',
    next: {
      tags: ['shortforms', 'update', taskId],
    },
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res: ApiResponse<ShortFormTask>) => res.result);
}

export async function copyTask(taskId: string) {
  const response = await fetch(`/api/v1/shorts/task/${taskId}/copy`, {
    method: 'post',
    next: {
      tags: ['shortforms', 'copy', taskId],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res: ApiResponse<ShortFormTask>) => res.result);
}

export async function removeTask(taskId: string) {
  const response = await fetch(`/api/v1/shorts/task/${taskId}`, {
    method: 'delete',
    next: {
      tags: ['shortforms', 'remove', taskId + ''],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}
