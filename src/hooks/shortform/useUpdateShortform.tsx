import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTask } from '@/entries/shortform/api/requestShortformTask';

export default function useUpdateShortform(
  shortformList: ShortFormTask[],
  assetId: number,
) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['shortforms', 'update'],
    mutationFn: ({ taskId, title }: { taskId: string; title: string }) =>
      updateTask(taskId, { title }),
    onSuccess: (data) => {
      const newTask = shortformList.slice();
      const index = newTask.findIndex((item) => item.id === data.id);

      index >= 0 && newTask.splice(index, 1, data);

      queryClient.setQueryData(['shortforms', assetId], newTask);
    },
  });

  return { onUpdateShortform: mutate, isLoading: isPending };
}
