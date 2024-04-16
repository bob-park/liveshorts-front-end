import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeTask } from '@/entries/shortform/api/requestShortformTask';

export default function useDeleteShortform(
  shortformList: ShortFormTask[],
  assetId: number,
  removeShortFormId: string,
) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ['shortforms', 'remove'],
    mutationFn: () => removeTask(removeShortFormId),
    onSuccess: () => {
      const prev = shortformList.slice();
      const index = prev.findIndex((item) => item.id === removeShortFormId);
      index >= 0 && prev.splice(index, 1);

      queryClient.setQueryData(['shortforms', assetId], prev);
    },
  });

  return { onDeleteShortform: mutate };
}
