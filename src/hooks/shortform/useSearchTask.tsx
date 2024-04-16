import { getTasksByAssetId } from '@/entries/shortform/api/requestShortformTask';

import { useQuery } from '@tanstack/react-query';

export default function useSearchTask(assetId: number) {
  const { data } = useQuery<ShortFormTask[]>({
    queryKey: ['shortforms', assetId],
    queryFn: () => getTasksByAssetId(assetId),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
    refetchInterval: 10 * 1_000,
  });

  return { tasks: data };
}
