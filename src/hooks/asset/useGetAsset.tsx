import { useQuery } from '@tanstack/react-query';

import { getDetailAsset } from '@/entries/asset/api/requestAsset';

export default function useGetAsset(assetId: number) {
  const { data } = useQuery<Asset>({
    queryKey: ['assets', 'detail', assetId + ''],
    queryFn: () => getDetailAsset(assetId),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
  });

  return { asset: data };
}
