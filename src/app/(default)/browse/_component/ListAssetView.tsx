import AssetListItem from '@/components/asset/AssetListItem';
import LoadingListAssets from './LoadingListAssets';
import EmptyAssets from './EmptyAssets';
import { Fragment } from 'react';

export default function ListAssetView(props: {
  isLoading: boolean;
  assets: Asset[];
  onClick?: (assetId: number) => void;
}) {
  // props
  const { isLoading, assets, onClick } = props;

  // handler
  const handleClick = (assetId: number) => {
    onClick && onClick(assetId);
  };

  return (
    <div className="grid grid-cols-1 min-w-[900px] gap-4">
      {/* header */}
      <div className="col-span-1 grid grid-cols-8 gap-4 text-center font-bold border-b-2 border-b-gray-300 h-12 mx-10 justify-center items-center">
        <div className="col-span-1"></div>
        <div className="col-span-2">제목</div>
        <div className="col-span-1">채널</div>
        <div className="col-span-1">대분류</div>
        <div className="col-span-1">크기</div>
        <div className="col-span-1">생성일</div>
        <div className="col-span-1">생성자</div>
      </div>

      {/* content */}
      {!isLoading && assets.length === 0 && <EmptyAssets />}
      {isLoading ? (
        <div className="col-span-1 border-b-1 border-b-gray-200">
          <LoadingListAssets size={30} />
        </div>
      ) : (
        assets.map((item) => (
          <div
            key={`asset-list-item-${item.assetId}`}
            className="col-span-1"
            onClick={() => handleClick(item.assetId)}
          >
            <AssetListItem asset={item} />
          </div>
        ))
      )}
    </div>
  );
}
