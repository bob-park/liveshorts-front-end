import { getTasksByAssetId } from '@/entries/shortform/api/requestShortformTask';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useRequestSearchTask(assetId: number) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['shortforms'],
    mutationFn: () => getTasksByAssetId(assetId),
    onMutate: () => {},
    onSuccess: (data) => {
      queryClient.setQueryData(['shortforms'], data);
    },
  });

  return {
    onSearchTask: mutate,
    isLoading: isPending,
  };
}
