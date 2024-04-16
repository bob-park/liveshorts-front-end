import { useMutation, useQueryClient } from '@tanstack/react-query';

import { copyTask } from '@/entries/shortform/api/requestShortformTask';

export default function useCopyShortform(
  shortformList: ShortFormTask[],
  assetId: number,
  onSuccess?: (copyShortForm: ShortFormTask) => void,
) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['shortforms', 'copy'],
    mutationFn: (taskId: string) => copyTask(taskId),
    onSuccess: (data) => {
      const newTask = shortformList.slice();
      newTask.unshift(data);
      queryClient.setQueryData(['shortforms', assetId], newTask);

      onSuccess && onSuccess(data);
    },
  });

  return { onCopyShortform: mutate, isLoading: isPending };
}
