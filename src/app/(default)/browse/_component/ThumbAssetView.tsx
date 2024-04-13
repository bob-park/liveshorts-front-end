import LoadingThumbanilAssets from './LoadingThumbnailAssets';
import EmptyAssets from './EmptyAssets';
import AssetViewItem from '@/components/asset/AssetViewItem';
import { Fragment } from 'react';

export default function ThumbnailAssetView(props: {
  assets: Asset[];
  isLoading: boolean;
  onClick?: (assetId: number) => void;
}) {
  const { assets, isLoading, onClick } = props;

  // handler
  const handleClick = (assetId: number) => {
    onClick && onClick(assetId);
  };

  return (
    <>
      {!isLoading && assets.length === 0 && <EmptyAssets />}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,min-content))] gap-8 justify-center justify-items-center content-center mt-4">
        {isLoading ? (
          <LoadingThumbanilAssets size={30} />
        ) : (
          assets.map((item) => (
            <div
              key={`asset-list-item-${item.assetId}`}
              className="col-span-1"
              onClick={() => handleClick(item.assetId)}
            >
              <AssetViewItem asset={item} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
