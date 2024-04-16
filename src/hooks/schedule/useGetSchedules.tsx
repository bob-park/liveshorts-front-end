import { useQuery } from '@tanstack/react-query';

import { getSchedules } from '@/entries/schedule/api';

export default function useGetSchedules(channelId: number, date: Date) {
  const { data, isFetching, refetch } = useQuery<RecordSchedule[]>({
    queryKey: ['schedules'],
    queryFn: () => getSchedules(channelId, { selectDate: date }),
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
  });

  return {
    schedules: data,
    isLoading: isFetching,
    onGetSchedules: refetch,
  };
}
