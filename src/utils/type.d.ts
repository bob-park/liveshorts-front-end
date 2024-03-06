type ApiResultState = 'SUCCESS' | 'FAILURE';

type ApiError = {
  message: string;
  detailMessage?: string;
};

type ApiResult<T> = {
  status: number;
  state: ApiResultState;
  data?: T;
  error?: ApiError;
  page?: {
    currentPage: number;
    size: number;
    totalCount: number;
    totalPage: number;
  };
};
