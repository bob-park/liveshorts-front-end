type ShortFormState = {
  isLoading: boolean;
  tasks: ShortFormTask[];
  page: Pagination;
};

type ShortFormTask = {
  id: string;
  title: string;
  template: ShortFormTemplate;
  status: TaskStatus;
  fitToTemplate: boolean;
  asset: { assetId: number };
  createdDate: Date;
  createdBy: string;
};

type ShortFormTemplate = {
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
};

type TaskStatus = 'WAITING' | 'PROCEEDING' | 'SUCCESS' | 'FAILURE';

type Pagination = {
  currentPage: number;
  size: number;
  totalCount: number;
  totalPage: number;
};