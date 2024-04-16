import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addTask } from '@/entries/shortform/api/requestShortformTask';

export default function useCreateShortform(
  onSuccess: (shortformId: string) => void,
) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['shortforms', 'add'],
    mutationFn: ({ assetId, title }: { assetId: number; title: string }) =>
      addTask(assetId, title),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shortforms'] });

      onSuccess(data.id);
    },
  });

  return { onCreateShortform: mutate, isLoading: isPending };
}
