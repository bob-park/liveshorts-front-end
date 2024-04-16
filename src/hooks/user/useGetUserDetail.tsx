import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getUserDetail } from '@/entries/user/api/requestUser';
import { useStore } from '@/shared/rootStore';

export default function useGetUserDetail() {
  const queryClient = useQueryClient();
  const updateDetailMe = useStore((state) => state.updateDetailMe);

  const { mutate } = useMutation({
    mutationKey: ['user', 'detail'],
    mutationFn: getUserDetail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'detail'] });
      updateDetailMe(data);
    },
  });

  return { onGetUserDetail: mutate };
}
