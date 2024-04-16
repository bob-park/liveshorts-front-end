import {} from 'react';

import { useQuery } from '@tanstack/react-query';

import { searchAsset } from '@/entries/asset/api/requestAsset';
import { parseParams } from '@/utils/parseUtils';

export default function useSearchAsset(
  page: number,
  searchAssetParams: SearchAssetParams,
) {
  const { data, isPending } = useQuery<ApiResponse<Asset[]>>({
    queryKey: ['assets', 'search'],
    queryFn: () => searchAsset(parseParams(page, searchAssetParams)),
    staleTime: 60 * 1_000,
    enabled: false,
  });

  return { searchResult: data, isPending };
}
