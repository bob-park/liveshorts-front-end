import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestUpdateStream } from "@/entries/stream/api/requestStream";

export default function useRequestUpdate(type: string, taskId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["shortforms", "detail", taskId],
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
      const shortform: ShortFormTask | undefined = queryClient.getQueryData(["shortforms", "detail", taskId]);

      if (!shortform) {
        return;
      }

      if (type === "video") {
        let streams = shortform.streams.video.slice();
        streams.push(data as VideoStream);
        shortform.streams.video = streams;
      }

      if (type === "title") {
        let streams = shortform.streams.title.slice();
        streams.push(data as TextStream);
        shortform.streams.title = streams;
      }

      if (type === "subtitle") {
        let streams = shortform.streams.subtitle.slice();
        streams.push(data as TextStream);
        shortform.streams.title = streams;
      }

      queryClient.setQueryData(["shortforms", "detail", taskId], shortform);
      onSuccess && onSuccess();
    },
  });

  return {
    onRequestUpdate: mutate,
    isLoadingUpdate: isPending,
  };
}
