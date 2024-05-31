interface StreamResponse {
  streamId: string;
  ref?: number;
  content?: string;
  time?: { startTime?: string; endTime?: string };
  options?: { x?: number; y?: number; width?: number; height?: number };
}

interface DeleteStreamResponse {
  streamId: string;
}
