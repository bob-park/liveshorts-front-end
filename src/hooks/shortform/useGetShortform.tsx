import { useQuery } from '@tanstack/react-query';

import { getTask } from '@/entries/shortform/api/requestShortformTask';

export default function useGetShortform(shortformId: string) {
  const { data, isPending, isFetching, refetch } = useQuery<ShortFormTask>({
    queryKey: ['shortforms', 'detail', shortformId],
    queryFn: () => getTask(shortformId),
    staleTime: 60 * 1_000,
    gcTime: 120 & 1_000,
    refetchInterval: 10 * 1_000,
  });

  return {
    shortform: data,
    isLoading: isFetching,
    onGetShortform: refetch,
  };
}
