import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestUpdateStream } from "@/entries/stream/api/requestStream";

export default function useRequestUpdate(taskId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["shorts", "task", taskId, "stream"],
    mutationFn: (body: {
      streamId: string;
      type: string;
      startTime?: string;
      endTime?: string;
      content?: string;
      ref?: string;
      options?: { x?: number; y?: number; width?: number; height?: number };
    }) => requestUpdateStream(taskId, body),
    onSuccess: (data) => {
      //   queryClient.setQueryData(["shortforms", "detail", data.id], data);

      onSuccess && onSuccess();
    },
  });

  return {
    onRequestUpdate: mutate,
    isLoadingUpdate: isPending,
  };
}
