import delay from "@/utils/delay";

export async function requestStream(
  taskId: string,
  body: { type: string; content?: string; ref?: string; startTime: string; endTime: string }
) {
  const { type, content, ref, startTime, endTime } = body;
  const formData = new FormData();
  formData.append("type", type);
  content && formData.append("content", content);
  ref && formData.append("ref", ref);
  formData.append("startTime", startTime);
  formData.append("endTime", endTime);

  const response = await fetch(`/api/v1/shorts/task/${taskId}/stream`, {
    method: "post",
    next: {
      tags: ["shortforms", "request", taskId + "", "stream"],
    },
    body: formData,
  });

  await delay(1_000);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res: ApiResponse<ShortFormTask>) => res.result);
}
