import { getTasksByAssetId } from '@/entries/shortform/api/requestShortformTask';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function useSearchTask(assetId: number) {
  const queryClient = useQueryClient();

  const { data } = useQuery<ShortFormTask[]>({
    queryKey: ['shortforms', assetId],
    queryFn: () => getTasksByAssetId(assetId),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
    refetchInterval: 10 * 1_000,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ['shortforms'],
    mutationFn: () => getTasksByAssetId(assetId),
    onMutate: () => {},
    onSuccess: (data) => {
      queryClient.setQueryData(['shortforms'], data);
    },
  });

  return { tasks: data || [], onSearchShortform: mutate, isLoading: isPending };
}
