import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getTask } from '@/entries/shortform/api/requestShortformTask';

export default function useGetShortform(shortformId: string) {
  const queryClient = useQueryClient();

  const { data } = useQuery<ShortFormTask>({
    queryKey: ['shortforms', 'detail', shortformId],
    queryFn: () => getTask(shortformId),
    staleTime: 60 * 1_000,
    gcTime: 120 & 1_000,
    refetchInterval: 10 * 1_000,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ['shortforms', 'detail', shortformId],
    mutationFn: () => getTask(shortformId),
    onSuccess: (data) => {
      queryClient.setQueryData(['shortforms', 'detail', shortformId], data);
    },
  });

  return {
    shortform: data,
    isLoading: isPending,
    onGetShortform: mutate,
  };
}
