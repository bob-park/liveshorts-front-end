type ShortFormState = {
  isLoading: boolean;
  tasks: ShortFormTask[];
  page: Pagination;
  extraTypes: ShortFormExtraType[];
  copiedTaskId?: string;
  shortform?: ShortFormTask;
};
