type AssetState = {
  assets: Asset[];
  assetsPage?: {
    totalPage: number;
    currentPage: number;
    totalCount: number;
  };
  searchAssetAfter: (
    assets: Asset[],
    page?: {
      totalPage: number;
      currentPage: number;
      totalCount: number;
    },
  ) => void;
  initAssetPage: () => void;
};
