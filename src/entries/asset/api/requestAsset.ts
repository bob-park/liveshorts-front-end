import delay from '@/utils/delay';

export async function searchAsset(params: URLSearchParams) {
  const response = await fetch(`/api/v1/asset/search?` + params, {
    method: 'get',
    next: {
      tags: ['assets', 'search'],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  await delay(1_000);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res: ApiResponse<Asset[]>) => res);
}

export async function getDetailAsset(assetId: number) {
  const response = await fetch(`/api/asset/video/${assetId}`, {
    method: 'get',
    next: {
      tags: ['assets', 'detail', assetId + ''],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res: ApiResponse<Asset>) => res.result);
}
