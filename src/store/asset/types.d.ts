type MetadataSchema = {
  schemaId: string;
  dataType: 'STRING' | 'DATE' | 'NUMBER';
  name: string;
};

type AssetMeta = {
  assetMetadataId: string;
  schema: MetadataSchema;
  metadataValue?: string;
};

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
  shortFormCount: number;
  uploadSnsCount: number;
  assetMetadataList: AssetMeta[];
  resolution?: string;
  fps?: number;
  ratio?: string;
  frameCount?: number;
  durationOfClip?: number;
  recordSchedule?: RecordChannel;
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
  existShortForm: boolean | string;
  onlyCreateShortFormByMe: boolean;
};

type Pagination = {
  currentPage: number;
  size: number;
  totalCount: number;
  totalPage: number;
};
