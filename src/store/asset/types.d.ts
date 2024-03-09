type AssetState = {
  assets: Asset[];
  isLoading: boolean;
  searchParams: SearchAssetParams;
  pagination: Pagination;
};

type Asset = {
  assetId: number;
  assetType: AssetType;
  title: string;
  fileSize?: number;
  description?: string;
  assetStatus: AssetStatus;
  category: Category;
  createdDate: Date;
  createdBy: string;
};

type AssetType = 'VIDEO' | 'AUDIO' | 'IMAGE' | 'FILE';
type AssetStatus = 'REGISTERED' | 'NOT_REGISTERED' | 'RESERVATION_RECORD';

type Category = {
  categoryId: number;
  name: string;
};

type SearchAssetParams = {
  page: number;
  size: number;
  isDeleted: boolean;
  assetType?: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'FILE';
  assetStatus?: AssetStatus;
  metas?: string[];
  title?: string;
};

type Pagination = {
  currentPage: number;
  size: number;
  totalCount: number;
  totalPage: number;
};
