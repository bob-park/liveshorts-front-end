import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addTask } from '@/entries/shortform/api/requestShortformTask';

export default function useCreateShortform(
  assetId: number,
  onSuccess: (shortformId: string) => void,
) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ['shortforms', 'add'],
    mutationFn: (title: string) => addTask(assetId, title),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shortforms'] });

      onSuccess(data.id);
    },
  });

  return { onCreateShortform: mutate };
}
