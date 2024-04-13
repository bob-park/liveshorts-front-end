interface Category {
  categoryId: number;
  name: string;
}

interface Asset {
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
  recordSchedule?: RecordSchedule;
}

interface AssetMeta {
  assetMetadataId: string;
  schema: MetadataSchema;
  metadataValue?: string;
}

interface MetadataSchema {
  schemaId: string;
  dataType: 'STRING' | 'DATE' | 'NUMBER';
  name: string;
}

type AssetType = 'VIDEO' | 'AUDIO' | 'IMAGE' | 'FILE';
type AssetStatus = 'REGISTERED' | 'NOT_REGISTERED' | 'RESERVATION_RECORD';

type SearchAssetsParams = {
  page: number;
  size: number;
  isDeleted: boolean;
  assetStatus?: AssetStatus;
  metas?: string[];
  title?: string;
  existShortForm: boolean | string;
  onlyCreateShortFormByMe: boolean;
};
