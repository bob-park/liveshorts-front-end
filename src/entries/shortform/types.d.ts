interface ShortFormTask {
  id: string;
  title: string;
  template: ShortFormTemplate;
  status: TaskStatus;
  fitToTemplate: boolean;
  asset: Asset;
  uploadInstances?: ShortFormUploadInstance[];
  taskExtras?: ShortFormExtra[];
  overlayTasks?: ShortFormOverlayTask[];
  createdDate: Date;
  createdBy: string;
  streams: { bgm: any[]; overlay: any[]; subtitle: TextStream[]; title: TextStream[]; video: VideoStream[] };
}

interface TextStream {
  streamId: stirng;
  content: string;
  time: { startTime: string; endTime: string };
  options?: any;
}

interface VideoStream {
  streamId: stirng;
  ref: number;
  time: { startTime: string; endTime: string };
  options?: { x?: number; y?: number; width?: number; height?: number };
}

interface ShortFormTemplate {
  templateId: string;
  title: string;
  isOverlay: boolean;
  videoPosition?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  options: any;
}

type TaskStatus = "WAITING" | "PROCEEDING" | "SUCCESS" | "FAILURE";

interface ShortFormUploadInstance {
  id: string;
}

interface ShortFormExtra {
  id: string;
  extraType: ShortFormExtraType;
  status: TaskStatus;
}

interface ShortFormExtraType {
  id: string;
  name: string;
}

interface ShortFormOverlayTask {
  id: string;
  status: TaskStatus;
}
