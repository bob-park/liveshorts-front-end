'use client';

// react
import { useEffect, useLayoutEffect, useState } from 'react';

// next
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// hooks
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

// componets
import AssetItem from '@/app/components/asset/AssetItem';
import SkeletonAssetItem from '@/app/components/asset/SkeletonAssetItem';
import SkeletonAsset from '@/app/components/asset/SkeletonAssetItem';

// action
import { assetActions } from '@/store/asset';

const { requestSearchAsset } = assetActions;

const LoadingAssets = (props: { size: number }) => {
  const { size } = props;

  return (
    <>
      {new Array(size).fill('').map((value, index) => (
        <SkeletonAsset key={`skeleton-asset-item-${index}`} />
      ))}
    </>
  );
};

export default function SearchAsseResult() {
  // store
  const dispatch = useAppDispatch();
  const { isLoading, assets } = useAppSelector((state) => state.asset);

  // useEffect
  useLayoutEffect(() => {
    handleSearch();
  }, []);

  // handle
  const handleSearch = () => {
    dispatch(
      requestSearchAsset({
        page: 0,
        size: 20,
        isDeleted: false,
        assetStatus: 'REGISTERED',
      }),
    );
  };

  return (
    <div className="grid grid-cols-1 m-2">
      {/* search form */}
      <div className="col-span-1 grid">search form</div>
      {/* contents */}
      <div className="col-span-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 justify-items-center content-center mt-4">
        {isLoading ? (
          <LoadingAssets size={10} />
        ) : (
          assets.map((item) => (
            <AssetItem
              key={`asset-item-${item.assetId}`}
              assetId={item.assetId}
              title={item.title}
              assetStatus={item.assetStatus}
              category={item.category.name}
              createdDate={item.createdDate}
            />
          ))
        )}
      </div>
    </div>
  );
}
