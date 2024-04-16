import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { searchAsset } from '@/entries/asset/api/requestAsset';
import { parseParams } from '@/utils/parseUtils';
import { useStore } from '@/shared/rootStore';

export default function useSearchAsset(searchAssetParams: SearchAssetParams) {
  const assets = useStore((state) => state.assets);
  const assetsPage = useStore((state) => state.assetsPage);
  const searchAssetAfter = useStore((state) => state.searchAssetAfter);

  const queryClient = useQueryClient();

  const { data, isPending } = useQuery<ApiResponse<Asset[]>>({
    queryKey: ['assets', 'search'],
    queryFn: () =>
      searchAsset(
        parseParams(
          !assetsPage ? 0 : assetsPage.currentPage + 1,
          searchAssetParams,
        ),
      ),
    staleTime: 60 * 1_000,
    enabled: false,
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationKey: ['assets', 'search'],
    mutationFn: () =>
      searchAsset(
        parseParams(
          !assetsPage ? 0 : assetsPage.currentPage + 1,
          searchAssetParams,
        ),
      ),
    onMutate: () => {
      if (!assetsPage) {
        queryClient.invalidateQueries({
          queryKey: ['assets', 'search'],
          exact: true,
        });
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['assets', 'search'], data);
      searchAssetAfter(data.result, data?.page);
    },
  });

  return {
    assets,
    page: data?.page,
    isPending,
    isLoading,
    onSearchAsset: mutate,
  };
}
