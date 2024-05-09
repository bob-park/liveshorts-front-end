import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestDeleteStream } from "@/entries/stream/api/requestStream";

export default function useRequestDelete(taskId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["shorts", "task", taskId, "stream"],
    mutationFn: (body: { streamId: string; type: string }) => requestDeleteStream(taskId, body),
    onSuccess: (data) => {
      //   queryClient.setQueryData(["shortforms", "detail", data.id], data);

      onSuccess && onSuccess();
    },
  });

  return {
    onRequestDelete: mutate,
    isLoadingDelete: isPending,
  };
}
