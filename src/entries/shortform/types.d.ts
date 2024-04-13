interface ShortFormTask {
  id: string;
  title: string;
  template: ShortFormTemplate;
  status: TaskStatus;
  fitToTemplate: boolean;
  asset: Asset;
  uploadInstances?: ShortFormUploadInstance[];
  taskExtras?: ShortFormExtra[];
  createdDate: Date;
  createdBy: string;
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

type TaskStatus = 'WAITING' | 'PROCEEDING' | 'SUCCESS' | 'FAILURE';

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
