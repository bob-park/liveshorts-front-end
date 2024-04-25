import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestStream } from "@/entries/stream/requestStream";

export default function useRequest(taskId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["shorts", "task", taskId, "stream"],
    mutationFn: (body: { type: string; content: string; startTime: string; endTime: string }) =>
      requestStream(taskId, body),
    onSuccess: (data) => {
      //   queryClient.setQueryData(["shortforms", "detail", data.id], data);

      onSuccess && onSuccess();
    },
  });

  return {
    onRequest: mutate,
    isLoading: isPending,
  };
}
