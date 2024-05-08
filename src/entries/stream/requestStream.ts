import delay from "@/utils/delay";

export async function requestStream(
  taskId: string,
  body: {
    type: string;
    startTime: string;
    endTime: string;
    content?: string;
    ref?: string;
    options?: { x?: number; y?: number; width?: number; height?: number };
  }
) {
  const { type, content, ref, startTime, endTime, options } = body;
  const formData = new FormData();
  formData.append("type", type);
  formData.append("startTime", startTime);
  formData.append("endTime", endTime);

  const optionsString = JSON.stringify(options);
  const optionsBlob = new Blob([optionsString], { type: "application/json" });

  content && formData.append("content", content);
  ref && formData.append("ref", ref);
  options && formData.append("options", optionsBlob, "application/json");

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
