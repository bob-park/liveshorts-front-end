import { requestExtra } from '@/entries/shortform/api/requestShortformExtra';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useRequestExtra(shortformId: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['shortforms', 'request', shortformId, 'extra'],
    mutationFn: (typeId: string) => requestExtra(shortformId, typeId),
    onSuccess: (data) => {
      queryClient.setQueryData(['shortforms', 'detail', data.id], data);
    },
  });

  return {
    onRequestExtra: mutate,
    isLoading: isPending,
  };
}
