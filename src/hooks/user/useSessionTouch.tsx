import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { touch } from '@/entries/user/api/requestAuth';
import { useStore } from '@/shared/rootStore';

export default function useSessionTouch() {
  const me = useStore((state) => state.me);
  const updateMe = useStore((state) => state.updateMe);

  const { data } = useQuery<LoginResponse>({
    queryKey: ['user', 'accessToken'],
    queryFn: touch,
    staleTime: 60 * 1_000,
    gcTime: 120 * 1_000,
    refetchInterval: 60 * 1_000,
  });

  // useEffect
  useEffect(() => {
    data && updateMe(data.accessToken);
  }, [data]);

  return { me };
}
