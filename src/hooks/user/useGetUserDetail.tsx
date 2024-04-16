import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getUserDetail } from '@/entries/user/api/requestUser';

export default function useGetUserDetail(onUpdateMe: (user: User) => void) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ['user', 'detail'],
    mutationFn: getUserDetail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'detail'] });
      onUpdateMe(data);
    },
  });

  return { onGetUserDetail: mutate };
}
