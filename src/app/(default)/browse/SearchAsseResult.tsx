'use client';

// react
import { useEffect, useLayoutEffect, useState } from 'react';

// nextjs
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// react icon
import { HiOutlineViewGrid, HiOutlineViewList } from 'react-icons/hi';

// hooks
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

// componets
import AssetViewItem from '@/app/components/asset/AssetViewItem';
import AssetListItem from '@/app/components/asset/AssetListItem';
import SkeletonAssetViewItem from '@/app/components/asset/SkeletonAssetViewItem';

// action
import { assetActions } from '@/store/asset';
import { Button } from 'react-daisyui';

const { requestSearchAsset } = assetActions;

type SearchAsseResultProps = {
  isListView: boolean;
};

const LoadingThumbanilAssets = (props: { size: number }) => {
  const { size } = props;

  return (
    <>
      {new Array(size).fill('').map((value, index) => (
        <SkeletonAssetViewItem key={`skeleton-asset-item-${index}`} />
      ))}
    </>
  );
};

const LoadingListAssets = (props: { size: number }) => {
  const { size } = props;

  return <div className="gird grid-cols-5"></div>;
};

const ThumbnailAssetView = (props: { assets: Asset[]; isLoading: boolean }) => {
  const { assets, isLoading } = props;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 justify-items-center content-center mt-4">
      {isLoading ? (
        <LoadingThumbanilAssets size={10} />
      ) : (
        assets.map((item) => (
          <AssetViewItem
            key={`asset-view-item-${item.assetId}`}
            assetId={item.assetId}
            title={item.title}
            assetStatus={item.assetStatus}
            category={item.category.name}
            createdDate={item.createdDate}
          />
        ))
      )}
    </div>
  );
};

const ListAssetView = (props: { isLoading: boolean; assets: Asset[] }) => {
  // props
  const { isLoading, assets } = props;

  return (
    <div className="grid grid-cols-1 min-w-[900px] gap-4">
      {/* header */}
      <div className="col-span-1 grid grid-cols-5 text-center font-bold">
        <div className="col-span-1">썸네일</div>
        <div className="col-span-1">대분류</div>
        <div className="col-span-2">제목</div>
        <div className="col-span-1">생성일</div>
        {/* <div>썸네일</div> */}
      </div>
      {/* content */}
      <div className="col-span-1">
        {isLoading ? (
          <LoadingListAssets size={10} />
        ) : (
          assets.map((item) => (
            <AssetListItem
              key={`asset-list-item-${item.assetId}`}
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
};

export default function SearchAsseResult(props: SearchAsseResultProps) {
  // props
  const { isListView } = props;

  // state
  const [listViewMode, setListViewMode] = useState<boolean>(isListView);

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

  const handleToggleViewMode = (isListView: boolean) => {
    setListViewMode(isListView);

    document.cookie = `isListView=${isListView}`;
  };

  return (
    <div className="grid grid-cols-1 m-2">
      {/* search form */}
      <div className="col-span-1 grid"></div>

      {/* view mode */}
      <div className="col-span-1 text-right">
        <div className="join m-7">
          <div className="tooltip w-full" data-tip="썸네일뷰">
            <Button
              className="join-item"
              active={!listViewMode}
              onClick={() => handleToggleViewMode(false)}
            >
              <HiOutlineViewGrid />
            </Button>
          </div>
          <div
            className="tooltip w-full"
            data-tip="리스트뷰"
            onClick={() => handleToggleViewMode(true)}
          >
            <Button className="join-item" active={listViewMode}>
              <HiOutlineViewList />
            </Button>
          </div>
        </div>
      </div>

      {/* contents */}
      <div className="col-span-1">
        {listViewMode ? (
          <ListAssetView isLoading={isLoading} assets={assets} />
        ) : (
          <ThumbnailAssetView isLoading={isLoading} assets={assets} />
        )}
      </div>
    </div>
  );
}
