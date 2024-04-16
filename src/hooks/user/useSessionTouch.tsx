import { useQuery } from '@tanstack/react-query';

import { touch } from '@/entries/user/api/requestAuth';

export default function useSessionTouch() {
  const { data } = useQuery<LoginResponse>({
    queryKey: ['user', 'accessToken'],
    queryFn: touch,
    staleTime: 60 * 1_000,
    gcTime: 300 * 1_000,
    refetchInterval: 60 * 1_000,
  });

  return { touchData: data };
}
