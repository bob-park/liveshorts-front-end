import { logout } from '@/entries/user/api/requestAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useLogout(onSuccess: () => void) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'accessToken'] });
      onSuccess();
    },
  });

  return { onLogout: mutate };
}
