import {} from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { searchAsset } from '@/entries/asset/api/requestAsset';
import { parseParams } from '@/utils/parseUtils';

export default function useRequestSearchAsset(
  page: number,
  searchAssetParams: SearchAssetParams,
  onAfter: (
    assets: Asset[],
    page?: { totalPage: number; currentPage: number; totalCount: number },
  ) => void,
) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['assets', 'search'],
    mutationFn: () => searchAsset(parseParams(page, searchAssetParams)),
    onMutate: () => {
      if (page == 0) {
        queryClient.invalidateQueries({
          queryKey: ['assets', 'search'],
          exact: true,
        });
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['assets', 'search'], data);
      onAfter(data.result, data?.page);
    },
  });

  return { onSearch: mutate, isLoading: isPending };
}
